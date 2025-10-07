/*
AI-generated: 0%
Human-written: 100% (re-used similar structure to other tests)
*/
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Home from "../src/components/Home";


import * as getPlanModule from "../src/plans/endpoints/getPlan";
vi.mock("../src/plans/endpoints/getPlan", () => ({
  getPlans: vi.fn(),
}));


vi.mock("../src/auth/AuthContext", () => ({
  useAuth: () => ({
    auth: { accessToken: "fakeToken" },
  }),
}));

vi.mock("../src/plans/PlansHeader", () => ({
  default: () => <div data-testid="plans-header">PlansHeader</div>,
}));

vi.mock("../src/plans/PlanCard", () => ({
  default: ({ plan }: { plan: any }) => (
    <div data-testid="plan-card">{plan.title}</div>
  ),
}));

describe("Home Component", () => {
  const mockPlans = [
    {
      _id: "1",
      title: "Plan 1",
      description: "Desc 1",
      location: { name: "Loc1", address1: "123", city: "City", state: "ST", zipcode: "12345" },
      start_time: "2025-10-05T10:00:00Z",
      end_time: "2025-10-05T12:00:00Z",
      created_by: "user1",
      user: { username: "alice" },
    },
    {
      _id: "2",
      title: "Plan 2",
      description: "Desc 2",
      location: { name: "Loc2", address1: "456", city: "City2", state: "ST", zipcode: "67890" },
      start_time: "2025-10-06T10:00:00Z",
      end_time: "2025-10-06T12:00:00Z",
      created_by: "user2",
      user: { username: "bob" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (getPlanModule.getPlans as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders PlanCards after loading plans", async () => {
    (getPlanModule.getPlans as any).mockResolvedValue({ data: mockPlans });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("plan-card")).toHaveLength(mockPlans.length);
      expect(screen.getByText("Plan 1")).toBeInTheDocument();
      expect(screen.getByText("Plan 2")).toBeInTheDocument();
    });
  });

  it("renders 'No plans available' if empty", async () => {
    (getPlanModule.getPlans as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No plans available/i)).toBeInTheDocument();
    });
  });

  it("renders PlansHeader component", async () => {
    (getPlanModule.getPlans as any).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(screen.getByTestId("plans-header")).toBeInTheDocument();
  });
});
