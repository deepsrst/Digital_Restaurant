
const router= require("express").Router()
const {registerUser, login, forgotPassword,veriyOTP,resetPassword} = require("../controller/auth/authController")

// routes here

router.route("/register").post(registerUser)
router.route("/login").post(login)
router.route("/forgotPassword").post(forgotPassword)
router.route("/verifyOTP").post(veriyOTP)
router.route("/resetPassword").post(resetPassword)

module.exports = router