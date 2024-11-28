import express from "express";
import {
  Getuser,
  deleteUser,
  addUser,
  updateUserRole,
} from "../controllers/Admin.js";
import { isAdmin } from "../middleware/verifyToken.js";

const AdminRoutes = express.Router();

// Admin-only routes for user management
AdminRoutes.get("/getuser", isAdmin, Getuser); // Retrieve all users
AdminRoutes.post("/adduser", isAdmin, addUser); // Create new user
AdminRoutes.put("/update-role/:userId", isAdmin, updateUserRole); // Update user role
AdminRoutes.delete("/delete/:id", isAdmin, deleteUser); // Delete user

export default AdminRoutes;
