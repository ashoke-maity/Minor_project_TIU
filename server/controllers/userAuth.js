const mongoose = require('mongoose');
const userModel = require('../models/userData')


// login
const userLogin = async(req, res) => {
    const { Email, ConfirmedPassword} = req.body;
    if (!Email || !ConfirmedPassword) {
        return res.send(400).json({
            status: 0,
            msg: "user not found !"
        })
    }

    try {
        // Find user by email OR username
        const user = await userModel.findOne({
          $or: [
            { Email: Email },
            { Username: Email }  // allow username in the same field
          ]
        });
    
        if (!user) {
          return res.status(404).json({ status: 0, msg: "User not found" });
        }
        // Check password
        if (user.ConfirmedPassword !== ConfirmedPassword) {
          return res.status(401).json({ status: 0, msg: "Invalid password" });
        }
    
        // Login success
        res.status(200).json({ status: 1, msg: "Login successful", user });
      } catch (err) {
        console.log(err);
        res.status(500).json({ status: 0, msg: "Server error" });
      }
};

// register
const userRegister = async(req,res) =>{
    const {FirstName, LastName, Age, PassingYear, Email, Password, ConfirmedPassword} = req.body;
    const userCollection = {FirstName, LastName, Age, PassingYear, Email, Password, ConfirmedPassword};
    const user = new userModel(userCollection);
    const registerData = await user.save();
    res.send(
        {
            status:200,
            msg:"Data saved Successfully",
            registerData
        }
    )
}

module.exports = {userLogin, userRegister};