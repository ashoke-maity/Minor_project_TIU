const jwt = require('jsonwebtoken');
const adminDatabase = require("../models/adminModel");
const verifyToken = async(req, res, next) =>{
  let token;
  let authHeader = req.headers.authorization;
  if(authHeader && authHeader.startsWith("Bearer ")){
    token = authHeader.split(" ")[1];
  }

  if(!token){
    return res.status(401).json({msg: "No token, authorization denied"});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminDatabase.findById(decoded.id).select("-Password"); // do not select password
    // console.log("Fetched Admin from DB:", admin); debug statement
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    req.admin = admin; // Now real admin details
    // console.log("The decoded admin is: ", req.admin); debug statement
    next();
  } catch (error) {
    res.status(400).json({msg: "Token is not valid"});
  }
}

module.exports = verifyToken;