import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USERS_KEY = "hl_users";               // danh sách người dùng đã đăng ký
const CURRENT_USER_KEY = "hl_current_user"; // người dùng đang đăng nhập

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email }

  useEffect(() => {
    // seed 1 tài khoản demo nếu chưa có gì
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (existing.length === 0) {
      const demo = { id: 1, name: "Demo User", email: "demo@homeliving.vn", password: "123456" };
      localStorage.setItem(USERS_KEY, JSON.stringify([demo]));
    }
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!found) throw new Error("Email hoặc mật khẩu không đúng.");
    const minimal = { name: found.name, email: found.email };
    setUser(minimal);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const register = ({ name, email, password }) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const exists = users.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) throw new Error("Email đã tồn tại.");
    users.push({ id: Date.now(), name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
