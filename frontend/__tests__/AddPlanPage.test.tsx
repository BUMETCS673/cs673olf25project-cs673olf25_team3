/*
AI-generated: 0%
Human-written: 100% (re-used similar structure to other tests)
*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import AddPlanPage from "../src/plans/AddPlanPage";
import * as getPlanByIdApi from "../src/plans/endpoints/getPlanById";
import * as addPlanApi from "../src/plans/endpoints/addPlan";
import * as editPlanApi from "../src/plans/endpoints/editPlan";

const mockNavigate = vi.fn();
const mockParams = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    useNavigate: () => mockNavigate,
    useParams: () => mockParams(),
  };
});

vi.mock("../src/auth/AuthContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    useAuth: () => ({
      auth: { accessToken: "fakeToken" },
    }),
  };
});

vi.mock("../src/plans/AddPlanForm", () => ({
  __esModule: true,
  default: ({ initialData, editMode, handleSubmit }: any) => (
    <div>
      <div data-testid="mock-form">
        Form loaded ({editMode ? "edit" : "add"})
      </div>
      {initialData && <div data-testid="initial-data">{initialData.title}</div>}
      <button
        onClick={() => handleSubmit({ title: "Test Plan" })}
        data-testid="submit-btn"
      >
        Submit
      </button>
    </div>
  ),
}));

describe("AddPlanPage Component (BDD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams.mockReturnValue({ planId: "123" });
  });

  it("loads plan data when in edit mode", async () => {
    vi.spyOn(getPlanByIdApi, "getPlanById").mockResolvedValue({
      _id: "123",
      title: "Existing Plan",
      description: "Mock description",
      location: {
        name: "Mock location",
        address1: "123 Main St",
        city: "Mock City",
        state: "CA",
        zipcode: "12345"
      },
      start_time: "2025-01-01T10:00:00Z",
      end_time: "2025-01-01T12:00:00Z",
      created_by: "21321"
    });

    render(
      <BrowserRouter>
        <AddPlanPage editMode={true} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getPlanByIdApi.getPlanById).toHaveBeenCalledWith("123", "fakeToken");   
     });
  });

  it("does not load plan data when not in edit mode", async () => {
    vi.spyOn(getPlanByIdApi, "getPlanById");

    render(
      <BrowserRouter>
        <AddPlanPage editMode={false} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(getPlanByIdApi.getPlanById).not.toHaveBeenCalled();
    });
  });

  it("submits new plan successfully and navigates home", async () => {
    vi.spyOn(addPlanApi, "addPlan").mockResolvedValue({});
    mockParams.mockReturnValue({ planId: undefined });

    render(
      <BrowserRouter>
        <AddPlanPage editMode={false} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(addPlanApi.addPlan).toHaveBeenCalledWith(
        { title: "Test Plan" },
        "fakeToken"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("submits edited plan successfully and navigates home", async () => {
    vi.spyOn(editPlanApi, "editPlan").mockResolvedValue({});
    render(
      <BrowserRouter>
        <AddPlanPage editMode={true} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(editPlanApi.editPlan).toHaveBeenCalledWith(
        "123",
        { title: "Test Plan" },
        "fakeToken"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("returns an error message when API fails", async () => {
    vi.spyOn(addPlanApi, "addPlan").mockResolvedValue({ errorMessage: "Error saving plan" });
    mockParams.mockReturnValue({ planId: undefined });

    render(
      <BrowserRouter>
        <AddPlanPage editMode={false} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByTestId("submit-btn"));

    await waitFor(() => {
      expect(addPlanApi.addPlan).toHaveBeenCalled();
    });

    const result = await addPlanApi.addPlan({
        title: "Test Plan",
        description: "",
        location: {
            name: "",
            address1: "",
            city: "",
            state: "",
            zipcode: ""
        },
        start_time: "",
        end_time: ""
    }, "fakeToken");
    expect(result.errorMessage).toBe("Error saving plan");
  });
});
