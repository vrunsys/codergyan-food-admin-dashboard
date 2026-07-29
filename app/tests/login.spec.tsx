import { describe, it, expect } from "vitest";
import { render, screen, } from "@testing-library/react";
import LoginPage from "../routes/login";
import { MemoryRouter } from "react-router";

describe("/auth/login page", () => {
  it("should render all required fields", () => {
    render(<MemoryRouter initialEntries={["/auth/login"]}>
      <LoginPage />
    </MemoryRouter>);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot password?" })).toBeInTheDocument();
  });
});