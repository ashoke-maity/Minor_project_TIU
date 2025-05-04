const userDatabase = require("../models/userModel");

// Fetch single user by ID
const fetchUserData = async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await userDatabase.findById(userID);

        if (!user) {
            return res.status(404).json({ status: 0, msg: "User not found!" });
        }

        res.status(200).json({ status: 1, msg: "User data fetched successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, msg: "Server error" });
    }
};

// ✅ Fetch all users
const fetchAllUsers = async (req, res) => {
    try {
        const users = await userDatabase.find();
        res.status(200).json({ status: 1, msg: "All users fetched successfully", users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 0, msg: "Server error while fetching users" });
    }
};

module.exports = {
    fetchUserData,
    fetchAllUsers
};
