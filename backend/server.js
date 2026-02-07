require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", require("./routes/authRoutes"));
app.use("/posts", require("./routes/postRoutes"));

// Handle multer errors (e.g. file too large)
app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "Image is too large. Maximum size is 5MB." });
  }
  if (err.message && err.message.includes("Only image files")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

app.listen(5000, () => console.log("Server running on 5000"));
