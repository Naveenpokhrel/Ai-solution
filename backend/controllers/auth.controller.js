import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import AdminLoginLog from '../models/AdminLoginLog.js';
import { config } from '../config/config.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign({ id: admin._id }, config.JWT_SECRET, { expiresIn: '24h' });

    // Log successful admin login
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const loginLog = new AdminLoginLog({
        admin_id: admin._id,
        captcha_status: req.body.captchaStatus || "Passed",
        ip_address: clientIp
      });
      await loginLog.save();
    } catch (logErr) {
      console.error('Failed to write admin login log:', logErr);
    }

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    id: req.admin._id,
    username: req.admin.username,
    email: req.admin.email
  });
};

export const updateProfile = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found.' });

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) admin.password = password; // Will trigger bcrypt pre-save hook

    await admin.save();
    res.json({
      message: 'Profile updated successfully.',
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
