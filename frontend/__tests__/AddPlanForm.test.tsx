/*
AI-generated: 0%
Human-written: 100% (re-used similar structure to other tests)
*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import AddPlanForm from "../src/plans/AddPlanForm";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom");
  return {
    ...actual,        
    useNavigate: () => mockNavigate 
  };
});

describe("AddPlanForm Component (BDD)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prefills form when initialData is provided", () => {
    const initialData = {
      title: "Test Plan",
      description: "Plan description",
      location: { name: "Place", address1: "123 St", city: "City", state: "ST", zipcode: "12345" },
      start_time: "2025-10-05T10:00:00Z",
      end_time: "2025-10-05T12:00:00Z",
    };

    render(
      <BrowserRouter>
        <AddPlanForm initialData={initialData} handleSubmit={vi.fn()} />
      </BrowserRouter>
    );

    expect(screen.getByLabelText("Title")).toHaveValue("Test Plan");
    expect(screen.getByLabelText("Description")).toHaveValue("Plan description");
    expect(screen.getByLabelText("Location Name")).toHaveValue("Place");
    expect(screen.getByLabelText("Address")).toHaveValue("123 St");
    expect(screen.getByLabelText("City")).toHaveValue("City");
    expect(screen.getByLabelText("State")).toHaveValue("ST");
    expect(screen.getByLabelText("Zipcode")).toHaveValue("12345");
  });

  it("calls handleSubmit with form data when Save button is clicked", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(null);

    render(
      <BrowserRouter>
        <AddPlanForm handleSubmit={handleSubmit} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "New Plan" } });
    fireEvent.change(screen.getByLabelText("Description"), { target: { value: "Description here" } });
    fireEvent.change(screen.getByLabelText("City"), { target: { value: "New City" } });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: "New Plan",
        description: "Description here",
        location: expect.objectContaining({ city: "New City" }),
      }));
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  it("shows validation errors returned from handleSubmit", async () => {
    const handleSubmit = vi.fn().mockResolvedValue({
      title: ["Title is required"],
      description: ["Description too short"],
    });

    render(
      <BrowserRouter>
        <AddPlanForm handleSubmit={handleSubmit} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(screen.getByText("Description too short")).toBeInTheDocument();
    });
  });

  it("navigates home when Cancel button is clicked", () => {
    render(
      <BrowserRouter>
        <AddPlanForm handleSubmit={vi.fn()} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});
