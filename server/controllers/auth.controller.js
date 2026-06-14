import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const formatUser = (user) => ({
  id: user.id,
  fullname: user.fullname,
  email: user.email,
  avatar: user.avatar || null,
});

export const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, password: hashed });

    const token = createToken(user.id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user.id);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json(formatUser(req.user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullname, email } = req.body;
    
    if (!fullname || !email) {
      return res.status(400).json({ message: "Fullname and email are required." });
    }

    if (email !== req.user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "Email is already taken." });
      }
    }

    req.user.fullname = fullname;
    req.user.email = email;
    await req.user.save();

    res.json(formatUser(req.user));
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }

    const isValid = await bcrypt.compare(currentPassword, req.user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid current password." });
    }

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // Fayl manzilini (URL) bazaga yozish
    const avatarUrl = `/uploads/${req.file.filename}`;
    req.user.avatar = avatarUrl;
    await req.user.save();

    res.json(formatUser(req.user));
  } catch (error) {
    next(error);
  }
};
