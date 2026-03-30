// Register page creates a user account and logs the user in immediately.
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/api/auth-api.js";
import { useAuth } from "@/auth/use-auth.js";

export function RegisterPage() {
  // Router helper for post-register navigation.
  const navigate = useNavigate();
  // Auth helper gives access to login() and current auth status.
  const { login, isAuthenticated } = useAuth();

  // Form + UI status state.
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, skip register page.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Form submit handler for registration.
  async function handleSubmit(event) {
    event.preventDefault();

    // Normalize email before API request.
    const email = formData.email.trim().toLowerCase();

    if (!email || !formData.password || !formData.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Register, persist JWT via auth context, and move to app.
      const response = await registerUser({ email, password: formData.password });
      login(response.token);
      navigate("/todos", { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1 className="auth-title">Register</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={formData.email}
            // Keep input controlled via component state.
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            autoComplete="email"
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            value={formData.password}
            // Keep input controlled via component state.
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            autoComplete="new-password"
          />

          <label htmlFor="register-confirm-password">Confirm Password</label>
          <input
            id="register-confirm-password"
            type="password"
            value={formData.confirmPassword}
            // Keep input controlled via component state.
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))
            }
            autoComplete="new-password"
          />

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
