import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import { AuthProvider } from "@/auth/auth-context.jsx";
import { LoginPage } from "@/pages/login.jsx";

test("renders login heading", () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>
  );

  expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
});
