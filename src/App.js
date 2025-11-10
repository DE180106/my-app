// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./App.css";
import Settings from "./components/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Feedback from "./pages/Feedback";
import ProductDetail from "./pages/ProductDetail";
import Payment from "./pages/Payment";
import YourOrders from "./pages/YourOrders";
import TrackOrder from "./pages/TrackOrder";
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ thêm dòng này
import PersonalInfor from "./pages/PersonalInfor";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* 🌐 Các trang công khai */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/personal-infor" element={<PersonalInfor />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                {/* 🔒 Các trang yêu cầu đăng nhập */}
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/your-orders"
                  element={
                    <ProtectedRoute>
                      <YourOrders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track-order/:id"
                  element={
                    <ProtectedRoute>
                      <TrackOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/track-order/:orderId/:itemId"
                  element={
                    <ProtectedRoute>
                      <TrackOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/feedback"
                  element={
                    <ProtectedRoute>
                      <Feedback />
                    </ProtectedRoute>
                  }
                />

                {/* 👑 Chỉ cho phép admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* ⚙️ User profile */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
