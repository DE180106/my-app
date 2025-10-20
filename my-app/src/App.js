import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // nếu chưa có, tạm comment dòng này
import Home from "./pages/Home";          // nếu chưa có, tạm đổi thành một component rỗng
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./pages/CartContext";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
