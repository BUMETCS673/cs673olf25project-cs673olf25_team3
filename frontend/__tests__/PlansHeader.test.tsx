/*
AI-generated: 0%
Human-written: 100% (re-used similar structure to other tests)
*/
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import PlansHeader from "../src/plans/PlansHeader";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderHeader = () =>
  render(
    <BrowserRouter>
      <PlansHeader />
    </BrowserRouter>
  );

describe("PlansHeader Component (BDD)", () => {
  it("renders Add Plan title", () => {
    renderHeader();
    expect(screen.getByText(/Add Plan/i)).toBeInTheDocument();
  });

  it("renders the Add icon button", () => {
    renderHeader();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("navigates to /plans/add when icon is clicked", () => {
    renderHeader();

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/plans/add");
  });

  it("renders with expected layout styles", () => {
    renderHeader();
    const title = screen.getByText(/Add Plan/i);

    expect(title).toHaveStyle("font-weight: 500");
    expect(title).toHaveTextContent("Add Plan");
  });
});
