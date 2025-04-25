const express = require('express');
const router = express.Router();
const {userLogin, userRegister} = require('../controllers/userAuth');

// login
router.post("/login", userLogin);

// register
router.post("/register", userRegister);

module.exports = router;