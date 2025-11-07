import User from "../model/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../middleware/jwt.middleware.js";
import transporter from "../config/nodemailer.config.js";

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://auth-t07c.onrender.com",
  "https://auth-bice-delta.vercel.app"
];

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

//For SingUp
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: "user",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: "user",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error,
    });
  }
};

//For Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      username: user.username,
      role: "user",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login Unsuccessful", error });
  }
};

//For Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout Unsuccessful", error });
  }
};

// Send OTP for Password Reset
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Sending OTP to:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    console.log("Generated OTP:", otp);

    const mailOptions = {
      from: `"Auth System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP - Do Not Reply",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #4F46E5; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you did not request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            <strong>DO NOT REPLY TO THIS EMAIL.</strong><br>
            This is an automated message. Please do not reply to this email address.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// Verify OTP and Reset Password
export const verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};
