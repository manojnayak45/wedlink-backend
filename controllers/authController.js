const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  path: "/",
};

const generateTokens = (admin) => {
  const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: admin._id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// ======================== SIGNUP ========================
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("📥 Signup Request:", req.body);

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      name,
      email,
      password: hash,
      role: "",
    });

    console.log("✅ Signup successful for:", email);
    res.status(201).json({ message: "Signup successful", admin: newAdmin });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ======================== LOGIN ========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔐 Login attempt for:", email);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.warn("🚫 Admin not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.warn("🚫 Incorrect password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(admin);

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    console.log("✅ Login successful:", email);
    res.status(200).json({
      message: "Login successful",
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ======================== REFRESH ========================
exports.refresh = (req, res) => {
  console.log("🔥 Refresh endpoint hit");
  console.log("🔍 Cookies received:", req.cookies);

  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    console.warn("🚫 No refresh token found in cookies");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    console.log("🔓 Refresh token valid for user ID:", decoded.id);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    console.log("✅ Access token refreshed for user ID:", decoded.id);
    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("❌ Invalid refresh token:", err.message);
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

// ======================== LOGOUT ========================
exports.logout = (req, res) => {
  console.log("🚪 Logout triggered");
  console.log("🍪 Cookies before clearing:", req.cookies);

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  console.log("✅ Cookies cleared successfully");
  res.status(200).json({ message: "Logged out successfully" });
};
