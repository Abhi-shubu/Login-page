const User = require('../models/User');
const Ip = require('../models/Ip');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcrypt')
const {
  checkUserLock,
  handleUserFailure,
  checkIpLock,
  handleIpFailure,
} = require("../Middleware/lockout");
exports.signup = async(req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};






exports.login = async (req, res) => {
  const { email, password } = req.body;
  const ip = req.ip;

  try {
    // --- IP Record ---
    let ipRecord = await Ip.findOne({ ip });
    if (!ipRecord) {
      ipRecord = await Ip.create({
        ip,
        failedAttempts: 0,
        firstAttempt: new Date(),
      });
    }

    // Block IP if currently locked
    if (checkIpLock(ipRecord)) {
      return res
        .status(429)
        .json({ message: "IP temporarily blocked due to excessive failed login attempts." });
    }

    // Reset IP attempts if window passed
    if (Date.now() - ipRecord.firstAttempt.getTime() > 5 * 60 * 1000) {
      ipRecord.failedAttempts = 0;
      ipRecord.firstAttempt = new Date();
      ipRecord.blockUntil = undefined;
      await ipRecord.save();
    }

    // --- Find User ---
    const user = await User.findOne({ email });
    if (!user) {
      ipRecord = handleIpFailure(ipRecord);
      await ipRecord.save();
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if user is locked
    if (checkUserLock(user)) {
      return res
        .status(423)
        .json({ message: "Account temporarily suspended due to too many failed attempts." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      handleUserFailure(user);
      await user.save();

      ipRecord = handleIpFailure(ipRecord);
      await ipRecord.save();

      return res.status(401).json({ message: "Invalid email or password." });
    }

    // --- Successful Login ---
    user.failedAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    ipRecord.failedAttempts = 0;
    ipRecord.blockUntil = undefined;
    await ipRecord.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};
