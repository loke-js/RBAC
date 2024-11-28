import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already Exist" });
    }
    const hashpassword = await bcryptjs.hashSync(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashpassword,
    });

    await newUser.save();

    res.status(200).json({ message: "user register successfully", newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "interanl server error" });
    console.log(error);
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked && user.lastLoginAttempt) {
        const lockDuration = 15 * 60 * 1000; // 15 minutes
        const unlockTime = new Date(user.lastLoginAttempt.getTime() + lockDuration);
        
        // Check if the lock period has passed
        if (new Date() < unlockTime) {
            return res.status(403).json({
                success: false,
                message: "Account is temporarily locked. Please try again later.",
            });
        }
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;
        user.lastLoginAttempt = new Date();

        // Lock account if max attempts reached
        if (user.loginAttempts >=4) {
            user.isLocked = true;
        }
        await user.save();
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            loginAttempts: user.loginAttempts
        });
    }
      // Successful login - reset login attempts
      user.loginAttempts = 0;
      user.isLocked = false;
      user.lastLoginAttempt = new Date();
      await user.save();
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, {
        expiresIn: '3d'
    });

    // Set cookie
    res.cookie("token", token, {
        httpOnly: true, // prevent XSS attack
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        sameSite: "strict", // prevent CSRF attacks
    });

    // Respond with success
    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    });
} catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "user Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "interanl server ereo" });
    console.log(error);
  }
};
const CheckUser = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    console.log(error);
  }
};

export { register, Login, Logout, CheckUser };
