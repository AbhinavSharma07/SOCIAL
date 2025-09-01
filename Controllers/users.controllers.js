// controllers/users.controllers.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const knex = require("../Models/registration");
const postModel = require("../Models/post");

const redisClient = redis.createClient({ url: `redis://localhost:6379` });
redisClient.on("error", (err) => console.error("Redis Error:", err));

// ========================= Helpers =========================
const generateToken = (payload, expiresIn = "1d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const getUid = (req) => {
  const token = req.cookies.token;
  if (!token) throw new Error("Access Denied: no token provided");
  return verifyToken(token);
};

const sendMail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASSWORD,
    },
  });
  return transporter.sendMail({ from: process.env.MAILUSER, to, subject, text, html });
};

// ========================= Auth =========================
const userRegister = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const existing = await knex.IsUser(email);

    if (existing.length) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 12);
    await knex.register({ ...req.body, password: hash });

    return res.status(201).json({ message: "Account created", email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await knex.IsUser(email);

    if (!user.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user[0].user_id, email: user[0].email });

    res.clearCookie("token");
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return res.status(200).json({
      message: "Login successful",
      userDetails: { userId: user[0].user_id, email: user[0].email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ========================= User =========================
const getMe = async (req, res) => {
  try {
    const data = await knex.me(req.params.username);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: "Unable to fetch user" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId } = getUid(req);
    await knex.updateProfile(req.body, userId);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to update profile" });
  }
};

// ========================= Password Reset =========================
const forgotP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await knex.IsUser(email);

    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken({ userId: user[0].user_id }, "1h");
    await knex.enter_token(token, email);

    await sendMail({
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="http://${req.headers.host}/fb/reset/${token}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Could not process request" });
  }
};

const resetP = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirm } = req.body;

    if (password !== confirm) {
      return res.status(422).json({ message: "Passwords do not match" });
    }

    const isVerify = await knex.isToken(token);
    if (!isVerify.length) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(password, 12);
    await knex.updatePassword(hash, isVerify[0].user_id);
    await knex.updateTokenNull(isVerify[0].user_id);

    await sendMail({
      to: isVerify[0].email,
      subject: "Password Changed",
      text: "Your password has been successfully updated.",
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Password reset failed" });
  }
};

// ========================= Posts =========================
const newpost = async (req, res) => {
  try {
    const { userId } = getUid(req);
    const { imageUrl, caption } = req.body;
    const data = await postModel.newpost(userId, caption, imageUrl);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: "Failed to create post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { userId } = getUid(req);
    const { post_id } = req.params;
    const post = await postModel.getPostUid(post_id);

    if (!post.length || post[0].user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await postModel.deletePost(post_id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete post" });
  }
};

const get_post = async (req, res) => {
  try {
    redisClient.get("allpost", async (err, cached) => {
      if (err) throw err;

      if (cached) {
        return res.status(200).json({
          posts: JSON.parse(cached),
          message: "Data retrieved from cache",
        });
      }

      const allPost = await postModel.get_post();
      redisClient.setEx("allpost", 600, JSON.stringify(allPost));

      res.status(200).json({ posts: allPost, message: "Cache miss" });
    });
  } catch (err) {
    res.status(400).json({ error: "Failed to fetch posts" });
  }
};

// ========================= Exports =========================
module.exports = {
  userRegister,
  userLogin,
  getMe,
  forgotP,
  resetP,
  newpost,
  deletePost,
  get_post,
  updateProfile,
  getUid,
};
