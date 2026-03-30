// Login page handles credential submission and session bootstrap.
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "@/api/auth-api.js";
import { useAuth } from "@/auth/use-auth.js";

export function LoginPage() {
  // Router helpers for redirecting after successful login.
  const navigate = useNavigate();
  const location = useLocation();
  // Auth helper gives access to login() and current auth status.
  const { login, isAuthenticated } = useAuth();

  // Form + UI status state.
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, skip login page.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Preserve original target page when redirected to /login.
  const fromPath = location.state?.from?.pathname || "/todos";

  // Form submit handler for login.
  async function handleSubmit(event) {
    event.preventDefault();

    // Normalize email before sending to API.
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Authenticate and save returned JWT in auth context.
      const response = await loginUser({ email, password });
      login(response.token);
      // Navigate back to the intended page.
      navigate(fromPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={formData.email}
            // Keep input controlled via component state.
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            autoComplete="email"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={formData.password}
            // Keep input controlled via component state.
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            autoComplete="current-password"
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}
