import UserModel from "../models/user.js";
// import jwt from 'jsonwebtoken';
import bcryptjs from "bcryptjs";
const Getuser = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "intenral server error" });
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const checkAdmin = await UserModel.findById(userId);

    if (checkAdmin.role == "admin") {
      return res.status(409).json({ message: "you can not delete admin" });
    }
    const user = await UserModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ message: "user delete successfully ", user });
  } catch (error) {
    res.status(500).json({ message: "intenral server error" });
    console.log(error);
  }
};


const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required"
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already Exist" });
    }
    // console.log("hello");
    // Hash password
    const hashedPassword = await bcryptjs.hashSync(password,10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    // Save user
    await newUser.save();

    res.status(200).json({
      message: "User added successfully",
    });
  } catch (error) {
    console.error("Add User Error:", error);
    
    res.status(500).json({
      message: error.message,
      error: "Email already exists"
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const {userId} = req.params;
    const { role } = req.body;
    const currentUser = req.user; // Assuming you have middleware to get the current user

    // Prevent changing your own role
    if (currentUser._id.toString() === userId) {
      return res.status(403).json({
        success: false,
        message: "You cannot change your own role"
      });
    }

    // Only allow admin to change roles
    if (currentUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Only admins can change user roles"
      });
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // Update user role
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { role }, 
      {new: true}
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

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
    console.error("Role Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    });
  }
};

export { Getuser, deleteUser, addUser ,updateUserRole };
