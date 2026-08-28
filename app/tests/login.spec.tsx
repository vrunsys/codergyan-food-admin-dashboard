import { describe, it, expect } from "vitest";
import { render, screen, } from "@testing-library/react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../routes/login";
import { MemoryRouter } from "react-router";
import { store } from "../store";

const queryClient = new QueryClient();

describe("/auth/login page", () => {
  it("should render all required fields", () => {
    render(<MemoryRouter initialEntries={["/auth/login"]}>
       <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <LoginPage />
        </QueryClientProvider>
       </Provider>
    </MemoryRouter>);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot password?" })).toBeInTheDocument();
  });
});