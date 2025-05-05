const express = require('express');
const router = express.Router();
const { userLogin, userRegister, userDashboard, userDelete, userUpdate } = require('../controllers/userController');
const verifyUserToken = require('../middlewares/userAuthMiddleware');

// login
router.post("/user/login", userLogin);

// register
router.post("/user/register", userRegister);

// user dashboard (profile section)
router.get("/user/dashboard", verifyUserToken, userDashboard);

// self delete
router.delete("/user/delete", verifyUserToken, userDelete);

// self update password
router.put("/user/update", verifyUserToken, userUpdate);

module.exports = router;