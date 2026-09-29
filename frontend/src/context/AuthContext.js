"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { apiRequest } from "@/lib/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "auth";

const listeners = new Set();
let cachedRaw = null;
let cachedValue = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? JSON.parse(raw) : null;
    } catch {
      cachedValue = null;
    }
  }
  return cachedValue;
}

function getServerSnapshot() {
  return null;
}

function subscribeNoop() {
  return () => {};
}

export function AuthProvider({ children }) {
  const auth = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  async function login(email, password) {
    const res = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const { token, ...user } = res.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    } catch {}
    emitChange();
    return user;
  }

  async function signup(name, email, password) {
    await apiRequest("/api/users", {
      method: "POST",
      body: { name, email, password },
    });
    return login(email, password);
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    emitChange();
  }

  const value = {
    user: auth?.user ?? null,
    token: auth?.token ?? null,
    ready,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
