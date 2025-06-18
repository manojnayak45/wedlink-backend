const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🌐 Detect Production
const isProd = process.env.NODE_ENV === "production";

// ✅ Common Cookie Settings
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "None" : "Lax",
  path: "/", // Can be "/" if you're not restricting it
};

// ✅ Token Generator
const generateTokens = (admin) => {
  const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: admin._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// ⛳ Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hash,
      role: "",
    });

    res.status(201).json({ message: "Signup successful", admin: newAdmin });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ⛳ Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const { accessToken, refreshToken } = generateTokens(admin);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(200).json({ message: "Login successful", admin });
};

// ⛳ Refresh Token Controller
exports.refresh = (req, res) => {
  console.log("🔥 Refresh endpoint hit");
  console.log("🔍 Cookies received:", req.cookies);

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.log("🚫 No refresh token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (err) {
    console.error("❌ Invalid refresh token:", err.message);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// ⛳ Logout Controller
exports.logout = (req, res) => {
  console.log("🧹 Clearing cookies...");
  console.log("🍪 Cookies before clearing:", req.cookies);

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({ message: "Logged out successfully" });
};
