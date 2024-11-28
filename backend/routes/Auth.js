import express from "express";
import { CheckUser, Login, Logout, register } from "../controllers/Auth.js";
import { IsUser } from "../middleware/verifyToken.js";

const AuthRoutes = express.Router();

// Public route for user registration
AuthRoutes.post("/register", register);

// Public route for user login
AuthRoutes.post("/login", Login);

// Public route for user logout
AuthRoutes.post("/logout", Logout);

// Protected route to check current user authentication
AuthRoutes.get("/CheckUser", IsUser, CheckUser);

export default AuthRoutes;
