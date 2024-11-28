import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/AuthSlice";
export default function Login() {
  const user = useSelector((state) => state.Auth);
  console.log(user);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const request = await post("/api/auth/login", { email, password });
      const reponse = request.data;

      if (request.status == 200) {
        if (reponse.user.role == "admin") {
          navigate("/admin");
        } else if (reponse.user.role == "user") {
          navigate("/");
        }
        toast.success(reponse.message);
        dispatch(SetUser(reponse.user));
      }
      console.log(reponse);
    } catch (error) {
      // Handle different types of rate-limiting and login errors
      if (error.response) {
        switch (error.response.status) {
          case 429: // Too Many Requests
            toast.error(
              error.response.data.message ||
                "Too many login attempts. Your account is temporarily locked.",
              {
                duration: 4000,
                style: {
                  background: "#FF6B6B",
                  color: "white",
                },
              }
            );

            // If lockout time is provided, show additional info
            if (error.response.data.lockedUntil) {
              const lockoutTime = new Date(error.response.data.lockedUntil);
              const formattedTime = lockoutTime.toLocaleTimeString();

              toast(`Account will be unlocked at ${formattedTime}`, {
                duration: 4000,
                style: {
                  background: "#FFD93D",
                  color: "black",
                },
              });
            }
            break;

          case 403: // Forbidden (Account Locked)
            toast.error(
              error.response.data.message ||
                "Your account is currently locked. Please try again later.",
              {
                duration: 4000,
                style: {
                  background: "#FF6B6B",
                  color: "white",
                },
              }
            );
            break;

          case 401: // Unauthorized
            toast.error("Invalid email or password. Please try again.", {
              duration: 3000,
              style: {
                background: "#FF6B6B",
                color: "white",
              },
            });
            break;

          default:
            toast.error("An error occurred during login. Please try again.", {
              duration: 3000,
            });
        }
      } else {
        // Network error or other issues
        toast.error(
          "Unable to connect to the server. Please check your internet connection.",
          {
            duration: 3000,
          }
        );
      }
      console.error(error);
    }
  };
  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              name=""
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="passowrd">Password</label>
            <input
              type="password"
              name=""
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
          </div>
          <button type="submit">Login</button>
          <p className="register-link">
            Not registered? <Link to={"/register"}>Register here</Link>
          </p>
        </form>
      </div>
    </>
  );
}
