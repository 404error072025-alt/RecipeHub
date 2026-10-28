import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-icon" aria-hidden="true">
          🍲
        </span>
        <span className="brand-name">Recipe<span>Hub</span></span>
      </NavLink>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end>
            <svg className="nav-item-icon recipes-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M8 3v8M13 3v8M18 3v8M8 8h10M13 11v18M24 3v26M24 3c4 3 5 8 0 11" />
            </svg>
            Recipes
          </NavLink>
        </li>
        <li>
          <NavLink to="/favorites">
            <svg className="nav-item-icon favorites-icon" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 28 4.8 17.2A7 7 0 0 1 14.7 7.3L16 8.6l1.3-1.3a7 7 0 0 1 9.9 9.9L16 28Z" />
            </svg>
            Favorites
          </NavLink>
        </li>
        <li>
          <NavLink to="/planner">
            <svg className="nav-item-icon planner-icon" viewBox="0 0 32 32" aria-hidden="true">
              <rect x="4" y="6" width="24" height="23" rx="4" />
              <path d="M10 3v7M22 3v7M4 13h24" />
              <path className="calendar-grid" d="M10 18h2v2h-2zm5 0h2v2h-2zm5 0h2v2h-2zm-10 5h2v2h-2zm5 0h2v2h-2zm5 0h2v2h-2z" />
            </svg>
            Meal Planner
          </NavLink>
        </li>
      </ul>

      <div className="nav-user">
        <span className="nav-user-profile">
          <span className="nav-user-avatar" aria-hidden="true">
            👩‍🍳
          </span>
          <span className="nav-user-name">{user?.name}</span>
        </span>
        <button onClick={handleLogout}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M8 3H4.5A1.5 1.5 0 0 0 3 4.5v11A1.5 1.5 0 0 0 4.5 17H8" />
            <path d="M11.5 6.5 15 10l-3.5 3.5M7 10h8" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}