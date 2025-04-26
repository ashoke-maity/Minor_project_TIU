const adminDatabase = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// login
const adminLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const admin = await adminDatabase.findOne({ Email });
    
    if (!admin) {
      return res.status(404).json({
        msg: "User not found !",
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
    res.send({
      msg: "Saved Successfully",
      adminData,
    });
  } catch (error) {
    console.log(error);
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
