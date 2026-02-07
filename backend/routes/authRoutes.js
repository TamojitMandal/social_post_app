const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ SIGNUP (Matches your AuthPage firstName/lastName)
router.post("/signup", async (req, res) => {
  // Change this line to destructure 'name' instead of firstName/lastName
  const { name, email, password } = req.body; 

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ 
      email, 
      password: hashedPassword, 
      username: name // Now 'name' is defined!
    });

    const token = jwt.sign(
      { userId: result._id.toString(), id: result._id.toString(), email: result.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ✅ SIGNIN (Matches your api.signIn call)
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: existingUser._id.toString(), id: existingUser._id.toString(), email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;