const userDatabase = require("../models/userModel");

const fetchUserData = async(req, res) =>{
    try {
        const {userID} = req.params;
        const user = await userDatabase.findById(userID);

        if(!user){
            return res.status(404).json({status: 0 ,msg:"User not found !"});
        }

        // return the user data to the admin
        res.status(200).json({ status: 1 ,msg: "User data fetched successfully", user});
    } catch (error) {
        console.log(error);
        res.status(500).json({status:0 ,msg:"Server error"});
    }
}

module.exports = fetchUserData;