import User from "../models/User.js";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

// Register controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (normalizedEmail === "demo-user@mydreamplace.invalid") {
      return res.status(400).json({ error: "That email address is reserved for the demo account" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({ name: name.trim(), email: normalizedEmail, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Public demo access. The account is deliberately limited to the user role.
export const demoLoginController = async (_req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(503).json({ error: "Authentication is not configured on the server" });
    }
    const email = "demo-user@mydreamplace.invalid";
    let user = await User.findOne({ email, isDemo: true });
    if (!user) {
      const password = await bcrypt.hash(randomBytes(32).toString("hex"), await bcrypt.genSalt(10));
      try {
        user = await User.create({ name: "Dream Place Demo Guest", email, password, role: "user", isDemo: true });
      } catch (error) {
        if (error.code !== 11000) throw error;
        user = await User.findOne({ email, isDemo: true });
        if (!user) throw error;
      }
    }
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ success: true, message: "Demo session ready", token, user: { id: user._id, name: user.name, email: user.email, role: "user" } });
  } catch (error) {
    console.error("Demo login error:", error.message);
    return res.status(503).json({ error: "Demo login is temporarily unavailable" });
  }
};

// login controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(503).json({ error: "Authentication is not configured on the server" });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

export const getUserInfo = async (req, res) => {
  const authorization = req.headers?.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  if (!process.env.JWT_SECRET) return res.status(503).json({ message: "Authentication is not configured." });
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded?.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(error?.name)) {
      return res.status(401).json({ message: "Invalid token" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
