const jwt = require("jsonwebtoken");

const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: 0, msg: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.Role !== "user") {
      return res.status(403).json({ status: 0, msg: "Unauthorized: Not a user" });
    }

    req.user = decoded; // set user info in request
    next(); // move to next middleware or controller
  } catch (err) {
    return res.status(400).json({ status: 0, msg: "Invalid token" });
  }
};

module.exports = verifyUserToken;
