import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

// Middleware to verify admin authentication
const isAdmin = async (req, res, next) => {
 try {
   // Check for token in cookies
   const token = req.cookies.token;
   if (!token) {
     return res
       .status(401)
       .json({ message: "Unauthorized: No token provided" });
   }

   // Verify and decode token
   const decoded = jwt.verify(token, process.env.JWT_SECRETE);
   const user = await UserModel.findById(decoded.userId);

   // Check if user exists
   if (!user) {
     return res.status(401).json({ message: "User not found" });
   }

   // Verify admin role
   if (user.role !== "admin") {
     return res
       .status(403)
       .json({ message: "Unauthorized: User is not an admin" });
   }

   // Attach user to request and proceed
   req.user = user;
   next();
 } catch (error) {
   // Handle token verification errors
   res.status(401).json({ message: "Authentication failed" });
   console.log(error);
 }
};

// Middleware to verify user authentication
const IsUser = async (req, res, next) => {
 try {
   // Check for token in cookies
   const token = req.cookies.token;
   if (!token) {
     return res
       .status(401)
       .json({ message: "Unauthorized: No token provided" });
   }

   // Verify and decode token
   const decoded = jwt.verify(token, process.env.JWT_SECRETE);
   const user = await UserModel.findById(decoded.userId);

   // Check if user exists
   if (!user) {
     return res.status(401).json({ message: "User not found" });
   }

   // Attach user to request and proceed
   req.user = user;
   next();
 } catch (error) {
   // Handle token verification errors
   res.status(401).json({ message: "Authentication failed" });
   console.log(error);
 }
};

export { isAdmin, IsUser };