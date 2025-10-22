import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USERS_KEY = "hl_users"; // danh sách người dùng đã đăng ký
const CURRENT_USER_KEY = "hl_current_user"; // người dùng đang đăng nhập

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, role }

  useEffect(() => {
    // seed 2 tài khoản demo nếu chưa có gì (user thường + admin)
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (existing.length === 0) {
      const demoUser = {
        id: 1,
        name: "Demo User",
        email: "demo@homeliving.vn",
        password: "123456",
        role: "user",
      };
      const demoAdmin = {
        id: 2,
        name: "Admin User",
        email: "admin@homeliving.vn",
        password: "admin123",
        role: "admin",
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([demoUser, demoAdmin]));
    }
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      const parsedUser = JSON.parse(saved);
      // Đảm bảo role được load (nếu không có, mặc định 'user')
      setUser({ ...parsedUser, role: parsedUser.role || "user" });
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) throw new Error("Email hoặc mật khẩu không đúng.");
    // Tạo minimal user với role (thêm role vào minimal)
    const minimal = { name: found.name, email: found.email, role: found.role };
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
    // Thêm role 'user' mặc định cho newUser
    const newUser = { id: Date.now(), name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Tự động login sau register (thêm role vào minimal)
    const minimal = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };
    setUser(minimal);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
    return true;
  };

  // Thêm hàm này để hỗ trợ quên mật khẩu (không ảnh hưởng code cũ)
  const resetPassword = (email, newPassword) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const userIndex = users.findIndex(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
    if (userIndex === -1) throw new Error("Email không tồn tại.");
    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
