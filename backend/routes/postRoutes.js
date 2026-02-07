const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");

// Store uploaded images in backend/uploads with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${(file.originalname || "image").replace(/\s/g, "-")}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /image\/(jpeg|jpg|png|gif|webp)/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed."), false);
  },
});

// create post (protected route) - accepts multipart/form-data with optional image file
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const rawId = req.user.userId || req.user.id || req.user._id;
    if (!rawId) {
      return res.status(401).json({
        error: "Your session is missing user info. Please sign out and sign in again.",
      });
    }
    const userId = mongoose.Types.ObjectId.isValid(rawId) ? rawId : null;
    if (!userId) {
      return res.status(401).json({
        error: "Invalid user in token. Please sign out and sign in again.",
      });
    }

    const text = req.body.text != null ? String(req.body.text).trim() : "";
    let imageUrl = null;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ error: "Post must have either text or image" });
    }

    const creator = await User.findById(userId).select("username").lean();
    const creatorName = creator?.username || "Anonymous";

    const post = await Post.create({
      userId,
      creatorName,
      text: text || undefined,
      image: imageUrl || undefined,
    });
    res.json(post);
  } catch (error) {
    if (error.message && error.message.includes("Only image files")) {
      return res.status(400).json({ error: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create post" });
  }
});

// get feed
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// like / unlike (toggle) - protected route
router.put("/:id/like", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID format." });
    }

    const userId = req.user.userId || req.user.id;
    if (!userId) return res.status(401).json({ error: "Invalid token. Please sign out and sign in again." });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const idStr = String(userId);
    const likes = Array.isArray(post.likes) ? post.likes.map((id) => String(id)) : [];

    if (likes.includes(idStr)) {
      post.likes = likes.filter((id) => id !== idStr);
    } else {
      post.likes = [...likes, idStr];
    }
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update like" });
  }
});

// comment (protected route)
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid post ID format." });
    }
    if (!req.body.text || !String(req.body.text).trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const userId = req.user.userId || req.user.id;
    if (!userId) return res.status(401).json({ error: "Invalid token. Please sign out and sign in again." });

    const creator = await User.findById(userId).select("username").lean();
    const username = creator?.username || "Anonymous";

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      username,
      text: String(req.body.text).trim(),
    });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

module.exports = router;
