/*
AI-generated: 0%
Human-written: 100% (re-used similar structure to other tests)
*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import PlanCard from "../src/plans/PlanCard";
import { AuthProvider, useAuth } from "../src/auth/AuthContext";
import * as deleteApi from "../src/plans/endpoints/deletePlan";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  };
});


vi.mock("../src/plans/endpoints/deletePlan", () => ({
  deletePlan: vi.fn(),
}));


vi.mock("../src/auth/AuthContext", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useAuth: () => ({
      auth: { accessToken: "fakeToken" },
    }),
  };
});

const mockPlan = {
  _id: "123",
  title: "Beach Trip",
  description: "A fun weekend getaway.",
  location: {
    name: "Miami Beach",
    address1: "123 Ocean Dr",
    city: "Miami",
    state: "FL",
    zipcode: "33139",
  },
  start_time: "2025-10-10T09:00:00Z",
  end_time: "2025-10-10T18:00:00Z",
  created_by: "user1",
  user: { username: "ashley" },
  showEdit: true,
};

const renderCard = (props = {}) =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <PlanCard plan={mockPlan} {...props} />
      </AuthProvider>
    </BrowserRouter>
  );

describe("PlanCard Component (BDD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders plan title, description, and location", () => {
    renderCard();

    expect(screen.getByText(/Beach Trip/i)).toBeInTheDocument();
    expect(screen.getByText(/A fun weekend getaway/i)).toBeInTheDocument();
    expect(screen.getByText(/Miami Beach, 123 Ocean Dr, Miami, FL 33139/i)).toBeInTheDocument();
  });

  it("shows username and time range", () => {
    renderCard();

    expect(screen.getByText(/Hosted By:/i)).toBeInTheDocument();
    expect(screen.getByText(/ashley/i)).toBeInTheDocument();
    expect(screen.getByText(/2025/i)).toBeInTheDocument(); // just verifies formatted date rendered
  });

  it("navigates to edit page when edit button is clicked", () => {
    renderCard();

    const editButton = screen.getByLabelText("edit plan");
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/plans/edit/123");
  });

  it("opens and closes delete confirmation dialog", async () => {
    renderCard();

    const deleteButton = screen.getByLabelText("delete plan");
    fireEvent.click(deleteButton);

    expect(await screen.findByText(/Delete Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancel/i));
    await waitFor(() =>
      expect(screen.queryByText(/Delete Plan/i)).not.toBeInTheDocument()
    );
  });

  it("calls deletePlan API when confirming delete", async () => {
    (deleteApi.deletePlan as any).mockResolvedValue({});

    const onUpdate = vi.fn();
    renderCard({ onUpdate });

    fireEvent.click(screen.getByLabelText("delete plan"));
    const confirmButton = await screen.findByText(/^Delete$/i);

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteApi.deletePlan).toHaveBeenCalledWith("123", "fakeToken");
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("shows an alert if delete fails", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    (deleteApi.deletePlan as any).mockResolvedValue({ errorMessage: "Failed to delete plan" });

    renderCard();

    fireEvent.click(screen.getByLabelText("delete plan"));
    const confirmButton = await screen.findByText(/^Delete$/i);
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Failed to delete plan");
    });

    alertMock.mockRestore();
  });
});
