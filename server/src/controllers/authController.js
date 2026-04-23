import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken({ id: user._id });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({ user: req.user });
}
