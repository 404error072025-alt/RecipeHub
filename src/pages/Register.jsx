import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShowcase from "../components/AuthShowcase";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-layout">
        <AuthShowcase />
        <div className="auth-card auth-card-register">
        <div className="auth-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <circle cx="13" cy="13" r="9" fill="#28563b" />
            <circle cx="13" cy="13" r="4" fill="#f8bf45" />
            <path d="m19.5 19.5 7 7" fill="none" stroke="#28563b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="13" cy="13" r="1.5" fill="#fff5d9" />
          </svg>
        </div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Build your personal recipe collection.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={submit}>
          <label htmlFor="register-name">Full Name</label>
          <div className="auth-input-wrap">
            <span aria-hidden="true">♙</span>
            <input
              id="register-name"
              autoComplete="name"
              required
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <label htmlFor="register-email">Email</label>
          <div className="auth-input-wrap">
            <span aria-hidden="true">✉</span>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <label htmlFor="register-password">Password</label>
          <div className="auth-input-wrap">
            <span className="auth-field-icon" aria-hidden="true">🔒</span>
            <input
              id="register-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Create password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPasswords((visible) => !visible)}
              aria-label={showPasswords ? "Hide passwords" : "Show passwords"}
              aria-pressed={showPasswords}
            >
              {showPasswords ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="register-confirm-password">Confirm Password</label>
          <div className="auth-input-wrap">
            <span className="auth-field-icon" aria-hidden="true">🔒</span>
            <input
              id="register-confirm-password"
              type={showPasswords ? "text" : "password"}
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
          </div>

          <button className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        </div>
      </div>
    </div>
  );
}
