import UserModel from "../models/user.js";
// Commented out unused imports
// import jwt from 'jsonwebtoken'; 
import bcryptjs from "bcryptjs";

/**
 * Retrieves all users from the database
 *  req - Express request object
 *  res - Express response object
 *  JSON response with all users or error
 */
const Getuser = async (req, res) => {
   try {
     // Fetch all users from the database without any filters
     const users = await UserModel.find();
     
     // Respond with 200 status code and users array
     res.status(200).json({ users });
   } catch (error) {
     // Handle any server-side errors during user retrieval
     res.status(500).json({ message: "internal server error" });
     console.log(error);
   }
};

/**
 * Deletes a user by their ID with admin role protection
 *  req - Express request object containing user ID
 *  res - Express response object
 *  JSON response indicating deletion status
 */
const deleteUser = async (req, res) => {
   try {
     // Extract user ID from request parameters
     const userId = req.params.id;
     
     // Check if the user to be deleted is an admin
     const checkAdmin = await UserModel.findById(userId);
     
     // Prevent deletion of admin users
     if (checkAdmin.role == "admin") {
       return res.status(409).json({ message: "you can not delete admin" });
     }
     
     // Attempt to delete the user
     const user = await UserModel.findByIdAndDelete(userId);
     
     // Handle case where user is not found
     if (!user) {
       return res.status(404).json({ message: "user not found" });
     }
     
     // Respond with success message and deleted user details
     res.status(200).json({ message: "user delete successfully ", user });
   } catch (error) {
     // Handle any server-side errors during deletion
     res.status(500).json({ message: "internal server error" });
     console.log(error);
   }
};

/**
 * Adds a new user to the database
 *  req - Express request object containing user details
 *  res - Express response object
 *  JSON response indicating user creation status
 */
const addUser = async (req, res) => {
   try {
     // Destructure user details from request body
     const { name, email, password } = req.body;
     
     // Validate input: ensure all required fields are present
     if (!name || !email || !password) {
       return res.status(400).json({
         message: "Name, email, and password are required"
       });
     }
     
     // Check if user with the same email already exists
     const existingUser = await UserModel.findOne({ email });
     if (existingUser) {
       return res
         .status(401)
         .json({ success: false, message: "User already Exist" });
     }
     
     // Hash the password for secure storage
     const hashedPassword = await bcryptjs.hashSync(password, 10);
     
     // Create a new user instance
     const newUser = new UserModel({
       name,
       email,
       password: hashedPassword
     });
     
     // Save the new user to the database
     await newUser.save();
     
     // Respond with success message
     res.status(200).json({
       message: "User added successfully",
     });
   } catch (error) {
     // Handle any server-side errors during user creation
     console.error("Add User Error:", error);
     res.status(500).json({
       message: error.message,
       error: "Email already exists"
     });
   }
};

/**
 * Updates user role with admin-only access
 *  req - Express request object containing user ID and new role
 *  res - Express response object
 *  JSON response indicating role update status
 */
const updateUserRole = async (req, res) => {
   try {
     // Extract user ID from request parameters
     const {userId} = req.params;
     
     // Extract new role from request body
     const { role } = req.body;
     
     // Get the current user from middleware (assumed authentication)
     const currentUser = req.user;
     
     // Prevent user from changing their own role
     if (currentUser._id.toString() === userId) {
       return res.status(403).json({
         success: false,
         message: "You cannot change your own role"
       });
     }
     
     // Ensure only admins can change roles
     if (currentUser.role !== 'admin') {
       return res.status(403).json({
         success: false,
         message: "Only admins can change user roles"
       });
     }
     
     // Validate the new role
     if (!['user', 'admin'].includes(role)) {
       return res.status(400).json({
         success: false,
         message: "Invalid role"
       });
     }
     
     // Update user role in the database
     const updatedUser = await UserModel.findByIdAndUpdate(
       userId,
       { role },
       {new: true}
     );
     
     // Handle case where user is not found
     if (!updatedUser) {
       return res.status(404).json({
         success: false,
         message: "User not found"
       });
     }
     
     // Respond with updated user details
     res.status(200).json({
       success: true,
       message: "User role updated successfully",
       user: {
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         role: updatedUser.role
       }
     });
   } catch (error) {
     // Handle any server-side errors during role update
     console.error("Role Update Error:", error);
     res.status(500).json({
       success: false,
       message: "Internal Server Error",
       error: error.message
     });
   }
};

export { Getuser, deleteUser, addUser, updateUserRole };