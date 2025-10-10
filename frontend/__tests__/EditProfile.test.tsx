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

vi.mock("../src/users/EditProfile", () => ({
  __esModule: true,
  default: ({ initialData, handleSubmit }: any) => (
    <div>
      <div data-testid="mock-form">
        Form loaded 
      </div>
      {initialData && <div data-testid="initial-data">{initialData.title}</div>}
      <button
        onClick={() => handleSubmit({ title: "Test Bio" })}
        data-testid="submit-btn"
      >
        Submit
      </button>
    </div>
  ),
}));

describe("EditProfile Component ", () => {
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
});
