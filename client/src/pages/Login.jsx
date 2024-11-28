import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { SetUser } from "../redux/AuthSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const request = await post("/api/auth/login", { email, password });
      const response = request.data;

      if (request.status === 200) {
        // Set user in Redux store and navigate based on role
        dispatch(SetUser(response.user));
        toast.success(response.message);

        if (response.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      // Handle various error scenarios
      if (error.response) {
        switch (error.response.status) {
          case 429: // Too Many Requests (Rate Limit)
            toast.error(
              error.response.data.message || 
              "Too many login attempts. Please try again later.",
              { duration: 4000, style: { background: "#FF6B6B", color: "white" } }
            );

            // If account lockout time is provided, show it
            if (error.response.data.lockedUntil) {
              const lockoutTime = new Date(error.response.data.lockedUntil).toLocaleTimeString();
              toast(`Account will be unlocked at ${lockoutTime}`, {
                duration: 4000,
                style: { background: "#FFD93D", color: "black" },
              });
            }
            break;

          case 403: // Account Locked
            toast.error(
              error.response.data.message || "Your account is locked. Please try again later.",
              { duration: 4000, style: { background: "#FF6B6B", color: "white" } }
            );
            break;

          case 401: // Unauthorized (Invalid Credentials)
            toast.error("Invalid email or password. Please try again.", {
              duration: 3000,
              style: { background: "#FF6B6B", color: "white" },
            });
            break;

          default: // Other Errors
            toast.error("An error occurred during login. Please try again.", {
              duration: 3000,
            });
        }
      } else {
        // Network or server issues
        toast.error("Unable to connect to the server. Check your internet connection.", {
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <p className="register-link">
          Not registered? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
