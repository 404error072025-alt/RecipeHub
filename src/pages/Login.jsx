import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShowcase from "../components/AuthShowcase";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-login">
      <div className="auth-layout">
        <AuthShowcase />
        <div className="auth-card auth-card-login">
        <div className="auth-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <circle cx="13" cy="13" r="9" fill="#28563b" />
            <circle cx="13" cy="13" r="4" fill="#f8bf45" />
            <path d="m19.5 19.5 7 7" fill="none" stroke="#28563b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="13" cy="13" r="1.5" fill="#fff5d9" />
          </svg>
        </div>
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Find recipes and plan delicious meals.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit}>
          <label htmlFor="login-email">Email</label>
          <div className="auth-input-wrap">
            <span aria-hidden="true">✉</span>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-field-icon" aria-hidden="true">🔒</span>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
