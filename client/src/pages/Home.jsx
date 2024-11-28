import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { Logout } from "../redux/AuthSlice";

export default function Home() {
  const user = useSelector((state) => state.Auth.user); // Get the current user from the Redux store
  const navigate = useNavigate(); // Navigation hook for routing
  const dispatch = useDispatch(); // Dispatch hook for Redux actions

  // Navigate to the admin page
  const gotoAdmin = () => {
    navigate("/admin");
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const request = await post("/api/auth/logout"); // Send logout request to API
      if (request.status === 200) {
        dispatch(Logout()); // Update Redux state to log out the user
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      console.error("Error during logout:", error); // Log any errors
    }
  };

  return (
    <div className="home-container">
      <div className="user-card">
        <h2>Welcome, {user?.name || "Guest"}</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        {/* Show "Go to Admin" button only if the user is an admin */}
        {user?.role === "admin" && (
          <button className="admin-btn" onClick={gotoAdmin}>
            Go to Admin
          </button>
        )}
      </div>
    </div>
  );
}
