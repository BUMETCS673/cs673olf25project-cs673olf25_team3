import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import SignUp from "../src/auth/Signup";
import { AuthProvider } from "../src/auth/AuthContext";
import * as authApi from "../src/auth/endpoints/auth";
import { registerUser } from "../src/auth/endpoints/auth";

vi.mock("../src/auth/endpoints/auth", () => ({
  registerUser: vi.fn(),
}));

const renderSignUp = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    </BrowserRouter>
  );

describe("SignUp Flow (BDD)", () => {
  it("disables Sign Up button when form is invalid", () => {
    renderSignUp();
    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).toBeDisabled();
  });

  it("shows error when passwords do not match", () => {
    renderSignUp();

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "different123" },
    });

    expect(
      screen.getByText(/Passwords do not match/i)
    ).toBeInTheDocument();
  });

  it("redirects to home after successful signup", async () => {
    (registerUser as Mock<typeof registerUser>).mockResolvedValue({
      access: "fakeAccess",
      refresh: "fakeRefresh",
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    const button = screen.getByRole("button", { name: /sign up/i });
    expect(button).toBeEnabled();
    fireEvent.click(button);

    await waitFor(() =>
      expect(authApi.registerUser).toHaveBeenCalledWith({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      })
    );
  });

  it("displays validation errors returned from API", async () => {
    (authApi.registerUser as Mock<typeof registerUser>).mockResolvedValue({
      errors: ["username: This username is already registered", "password: Password is not long enough",
      ],
    });

    renderSignUp();

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "taken@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/This username is already registered/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Password is not long enough/i)
      ).toBeInTheDocument();
    });
  });
});
