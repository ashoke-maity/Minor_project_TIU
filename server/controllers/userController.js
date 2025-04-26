const userDatabase = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// user login
const userLogin = async (req, res) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res
      .status(400)
      .json({ status: 0, msg: "Email and password required" });
  }

  try {
    const user = await userDatabase.findOne({ Email });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ status: 0, msg: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        Role: user.Role,
        FirstName: user.FirstName,
        LastName: user.LastName,
        PassoutYear: user.PassoutYear,
        Email: user.Email,
      }, // dynamic role in case it's extended
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: 1, msg: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// user register
const userRegister = async (req, res) => {
  const {
    FirstName,
    LastName,
    PassoutYear,
    Email,
    Password,
    ConfirmedPassword,
  } = req.body;

  if (
    !FirstName ||
    !LastName ||
    !PassoutYear ||
    !Email ||
    !Password ||
    !ConfirmedPassword
  ) {
    return res.status(400).json({ status: 0, msg: "All fields are required" });
  }

  if (Password !== ConfirmedPassword) {
    return res.status(400).json({ status: 0, msg: "Passwords do not match" });
  }

  try {
    const existingUser = await userDatabase.findOne({ Email });
    if (existingUser) {
      return res
        .status(409)
        .json({ status: 0, msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const userEntity = {
      FirstName,
      LastName,
      PassoutYear,
      Email,
      Password: hashedPassword,
      Role: "user",
    };

    const user = new userDatabase(userEntity);
    const registerData = await user.save();

    res
      .status(200)
      .json({ status: 1, msg: "Registration successful", registerData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// User dashboard (user profile section)
const userDashboard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    res.status(200).json({
      status: 1,
      msg: "Welcome to the user dashboard",
      user: req.user, // The user object will now contain all the user details
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};


module.exports = { userLogin, userRegister, userDashboard };
