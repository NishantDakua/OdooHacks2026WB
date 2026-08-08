import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PageLoadingFallback from "./components/ui/PageLoadingFallback";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const VendorSignup = lazy(() => import("./pages/VendorSignup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));

const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const Rentals = lazy(() => import("./pages/Rentals"));
const Address = lazy(() => import("./pages/checkout/Address"));
const Payment = lazy(() => import("./pages/checkout/Payment"));
const Success = lazy(() => import("./pages/checkout/Success"));

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const RentalOrdersList = lazy(() => import("./pages/admin/RentalOrdersList"));
const RentalOrderDetails = lazy(() => import("./pages/admin/RentalOrderDetails"));
const NewRentalOrder = lazy(() => import("./pages/admin/NewRentalOrder"));
const ProductList = lazy(() => import("./pages/admin/ProductList"));
const CreateProduct = lazy(() => import("./pages/admin/CreateProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const RentalScheduler = lazy(() => import("./pages/admin/RentalScheduler"));
const InvoiceList = lazy(() => import("./pages/admin/InvoiceList"));
const CustomerList = lazy(() => import("./pages/admin/CustomerList"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <ToastProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
          <Suspense fallback={<PageLoadingFallback />}>
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

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<RentalOrdersList />} />
              <Route path="orders/new" element={<NewRentalOrder />} />
              <Route path="orders/:id" element={<RentalOrderDetails />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<CreateProduct />} />
              <Route path="products/:id/edit" element={<EditProduct />} />
              <Route path="scheduler" element={<RentalScheduler />} />
              <Route path="invoices" element={<InvoiceList />} />
              <Route path="customers" element={<CustomerList />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Vendor Route Alias */}
            <Route path="/vendor/*" element={<Navigate to="/admin" replace />} />

            {/* Unknown routes */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  </ToastProvider>
  );
}

export default App;