const userDatabase = require("../models/userModel");

// Fetch single user by ID (admin only)
const fetchUserData = async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await userDatabase.findById(userID);

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User not found!" });
    }

    res
      .status(200)
      .json({ status: 1, msg: "User data fetched successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

// ✅ Fetch all users (admin only)
const fetchAllUsers = async (req, res) => {
  try {
    const users = await userDatabase.find();
    res
      .status(200)
      .json({ status: 1, msg: "All users fetched successfully", users });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: 0, msg: "Server error while fetching users" });
  }
};

// Inside fetchUserDataController.js
const adminDeleteUser = async (req, res) => {
  try {
    const { userID } = req.body;
    const deletedUser = await userDatabase.findByIdAndDelete(userID);
    if (!deletedUser) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }
    res.status(200).json({ status: 1, msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, msg: "Server error" });
  }
};

//   admin update user
const adminUpdateUser = async (req, res) => {
  try {
    // Destructuring the fields from the request body
    const { userID, firstName, lastName, email } = req.body;

    // Validate the inputs
    if (!userID || !firstName || !lastName || !email) {
      return res
        .status(400)
        .json({
          status: 0,
          msg: "User ID, first name, last name, and email are required",
        });
    }

    // Optionally, check if the email already exists in the system
    const existingUser = await userDatabase.findOne({ Email: email });
    if (existingUser && existingUser._id.toString() !== userID) {
      return res
        .status(400)
        .json({ status: 0, msg: "Email is already in use by another user" });
    }

    // Update the user with the new data
    const updatedUser = await userDatabase.findByIdAndUpdate(
      userID,
      { FirstName: firstName, LastName: lastName, Email: email, 
        updatedByAdminAt: new Date()
      }, // Correcting the fields to be updated
      { new: true } // This will return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 0, msg: "User not found" });
    }

    res.status(200).json({
      status: 1,
      msg: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ status: 0, msg: "Server error while updating user" });
  }
};

module.exports = {
  fetchUserData,
  fetchAllUsers,
  adminDeleteUser,
  adminUpdateUser,
};
