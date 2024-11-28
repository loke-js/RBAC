import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing necessary components for routing
import Home from "./pages/Home"; // Home page component
import Login from "./pages/Login"; // Login page component
import Register from "./pages/Register"; // Register page component
import Admin from "./pages/Admin"; // Admin page component
import { Toaster } from "react-hot-toast"; // Toaster component for showing toast messages
import AdminLaouts from "./Layouts/AdminLaouts"; // Admin layout wrapper
import UserLayout from "./Layouts/UserLayout"; // User layout wrapper
import PublicLayouts from "./Layouts/PublicLayouts"; // Public layout wrapper (for login and register pages)
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for dispatching and selecting state
import { updateUser } from "./redux/AuthSlice"; // Action to update user information in the Redux store

export default function App() {
  // Accessing the user data from Redux store
  const user = useSelector((state) => state.Auth.user);
  const disptch = useDispatch(); // Redux dispatch function to trigger actions

  // useEffect hook to dispatch updateUser action when the component mounts or when 'user' changes
  useEffect(() => {
    disptch(updateUser()); // Dispatch action to fetch user data
  }, [user]);

  return (
    <>
      {/* Setting up routing with BrowserRouter */}
      <BrowserRouter>
        {/* Including the toaster component to show notifications */}
        <Toaster />
        {/* Defining the routes for different pages */}
        <Routes>
          {/* User routes with UserLayout wrapper */}
          <Route path="/" element={<UserLayout />}>
            {/* Home page for authenticated users */}
            <Route index element={<Home />} />
          </Route>

          {/* Admin routes with AdminLaouts wrapper */}
          <Route path="/admin" element={<AdminLaouts />}>
            {/* Admin page for admin users */}
            <Route index element={<Admin />} />
          </Route>

          {/* Public routes with PublicLayouts wrapper (for login and register pages) */}
          <Route path="/" element={<PublicLayouts />}>
            {/* // Login page for non-authenticated users */}
            <Route path="login" element={<Login />} />
            {/* // Register page for non-authenticated users */}
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
