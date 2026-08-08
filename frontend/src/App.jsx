import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VendorSignup from "./pages/VendorSignup";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Rentals from "./pages/Rentals";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { WishlistProvider } from "./context/WishlistContext";
import Address from "./pages/checkout/Address";
import Payment from "./pages/checkout/Payment";
import Success from "./pages/checkout/Success";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/vendor-signup" element={<VendorSignup />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Default route */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout/address"
              element={
                <ProtectedRoute>
                  <Address />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/checkout/success"
              element={
                <ProtectedRoute>
                  <Success />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="/terms"
              element={
                <ProtectedRoute>
                  <Terms />
                </ProtectedRoute>
              }
            />

            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rentals"
              element={
                <ProtectedRoute>
                  <Rentals />
                </ProtectedRoute>
              }
            />

            {/* Unknown routes */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;