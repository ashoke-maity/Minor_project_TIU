const adminDatabase = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendAdminCredentials } = require("../utils/emailService");
const dotenv = require('dotenv').config();

// login
const adminLogin = async (req, res) => {
  try {
    const { AdminID, Password } = req.body;
    const admin = await adminDatabase.findOne({ AdminID });
    
    if (!admin) {
      return res.status(404).json({
        msg: "Admin not found !",
      });
    }

    const isMatch = await bcrypt.compare(Password, admin.Password);
    if(!isMatch) {
        return res.status(400).json({
            msg: "Invalid Credentials"
        })
    }

    const token = jwt.sign(
        {id:admin._id, Role: admin.Role}, process.env.JWT_SECRET,
        {expiresIn: "1h"}
    );
    res.status(200).json({token});

  } catch (error) {
    console.log("something went wrong !");
  }
};

// register
const adminRegistration = async (req, res) => {
  try {
    const { FirstName, LastName, Email, Password} = req.body;
    // hashing the password
    const hashedPassword = await bcrypt.hash(Password, 10); // 10 is the salt number
    const adminEntity = { FirstName, LastName, Email, Password: hashedPassword};
    const admin = new adminDatabase(adminEntity);
    const adminData = await admin.save();

        // Send credentials email
    await sendAdminCredentials({
      to: Email,
      name: `${FirstName} ${LastName}`,
      adminID: adminData.AdminID,
      password: Password // plaintext password sent only on registration
    });

    res.send({
      msg: "Admin registered successfully and credentials sent via email.",
      adminData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Registration failed." });
  }
};

// admin dashboard
const adminDashboard = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ status: 0, msg: "Unauthorized access" });
    }

    res.status(200).json({
      status: 1,
      msg: `Welcome, ${req.admin.FirstName} ${req.admin.LastName}`,
      admin: req.admin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};


module.exports = { adminLogin, adminRegistration, adminDashboard};
