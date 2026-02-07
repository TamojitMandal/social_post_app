const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  // Storing username directly as per assignment Step 2
  username: { type: String, required: true }, 
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  // Reference to the user who created the post
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Adding the creator's username here makes the Feed much faster to load
  creatorName: String, 
  text: String,
  image: String,
  // Assignment requires saving usernames of people who liked
  likes: [String], 
  comments: [commentSchema],
}, { timestamps: true }); // Automatically manages createdAt and updatedAt

module.exports = mongoose.model("Post", postSchema);