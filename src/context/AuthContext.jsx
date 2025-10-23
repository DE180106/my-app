import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USERS_KEY = "hl_users";
const CURRENT_USER_KEY = "hl_current_user";

const normEmail = (s) => (s || "").trim().toLowerCase();

// ====== ADMIN “CỨNG” TRONG CODE ======
const HARDCODED_ADMINS = [
  {
    name: "Admin User",
    email: "admin@homeliving.vn",
    password: "admin123",
    role: "admin",
  },
];

// (tuỳ chọn) tiện ích reset nhanh cho môi trường demo
export const resetDemoAuth = () => {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { name, email, role }

  useEffect(() => {
    // KHÔNG seed admin vào localStorage nữa
    // Nếu muốn có 1 user demo bình thường thì seed nhẹ (có thể bỏ hẳn nếu không cần)
    const DEMO_USER = {
      id: 1,
      name: "Demo User",
      email: "demo@homeliving.vn",
      password: "123456",
      role: "user",
    };

    let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    // đảm bảo role cho các user cũ
    users = users.map((u) => ({ ...u, role: u.role || "user" }));

    // Seed demo user nếu chưa có (KHÔNG đụng đến admin)
    if (!users.some((u) => normEmail(u.email) === normEmail(DEMO_USER.email))) {
      users.push(DEMO_USER);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Khôi phục phiên
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Nếu là admin cứng, đảm bảo role=admin
      const isHardAdmin = HARDCODED_ADMINS.some(
        (a) => normEmail(a.email) === normEmail(parsed.email)
      );
      if (isHardAdmin) {
        const admin = HARDCODED_ADMINS.find(
          (a) => normEmail(a.email) === normEmail(parsed.email)
        );
        setUser({ name: admin.name, email: admin.email, role: admin.role });
      } else {
        setUser({ ...parsed, role: parsed.role || "user" });
      }
    }
  }, []);

  const login = (email, password) => {
    const e = normEmail(email);

    // 1) Thử với admin cứng trước
    const hardAdmin = HARDCODED_ADMINS.find(
      (a) => normEmail(a.email) === e
    );
    if (hardAdmin) {
      if (hardAdmin.password !== password) {
        throw new Error("Email hoặc mật khẩu không đúng."); // sai pass admin
      }
      const minimal = {
        name: hardAdmin.name,
        email: hardAdmin.email,
        role: hardAdmin.role, // 'admin'
      };
      setUser(minimal);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
      return true;
    }

    // 2) Nếu không phải admin cứng → kiểm tra localStorage users
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const found = users.find(
      (u) => normEmail(u.email) === e && u.password === password
    );
    if (!found) throw new Error("Email hoặc mật khẩu không đúng.");

    const minimal = { name: found.name, email: found.email, role: found.role || "user" };
    setUser(minimal);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const register = ({ name, email, password }) => {
    const e = normEmail(email);

    // Không cho đăng ký trùng email admin cứng
    if (HARDCODED_ADMINS.some((a) => normEmail(a.email) === e)) {
      throw new Error("Email này được dành cho tài khoản quản trị hệ thống.");
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (users.some((u) => normEmail(u.email) === e)) {
      throw new Error("Email đã tồn tại.");
    }
    const newUser = { id: Date.now(), name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const minimal = { name: newUser.name, email: newUser.email, role: "user" };
    setUser(minimal);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
    return true;
  };

  const resetPassword = (email, newPassword) => {
    const e = normEmail(email);

    // Không cho reset mật khẩu cho admin cứng (vì pass nằm trong code)
    if (HARDCODED_ADMINS.some((a) => normEmail(a.email) === e)) {
      throw new Error(
        "Không thể đổi mật khẩu cho tài khoản quản trị hệ thống (admin cứng trong code)."
      );
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const idx = users.findIndex((u) => normEmail(u.email) === e);
    if (idx === -1) throw new Error("Email không tồn tại.");
    users[idx].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Nếu đang đăng nhập chính email này → đồng bộ session (không lưu password)
    const cur = localStorage.getItem(CURRENT_USER_KEY);
    if (cur) {
      const cu = JSON.parse(cur);
      if (normEmail(cu.email) === e) {
        const minimal = {
          name: users[idx].name,
          email: users[idx].email,
          role: users[idx].role || "user",
        };
        setUser(minimal);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(minimal));
      }
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};
