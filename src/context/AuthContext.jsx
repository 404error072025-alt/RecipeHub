import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(url, options = {}) {
  const fullUrl = `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await request("/api/auth/me/");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (name, email, password) => {
    const data = await request("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const data = await request("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await request("/api/auth/logout/", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
