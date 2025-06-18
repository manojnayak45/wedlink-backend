const express = require("express");
const { signup, login } = require("../controllers/authController");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh); // 👈 add this line

module.exports = router;
