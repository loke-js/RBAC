import express from "express";
import { Getuser, deleteUser , addUser ,updateUserRole } from "../controllers/Admin.js";
import { isAdmin } from "../middleware/verifyToken.js";

const AdminRoutes = express.Router();
AdminRoutes.get("/getuser", isAdmin, Getuser);
AdminRoutes.post("/adduser",isAdmin ,addUser);
AdminRoutes.put('/update-role/:userId',isAdmin, updateUserRole);
AdminRoutes.delete("/delete/:id", isAdmin, deleteUser);

export default AdminRoutes;
