const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

const validateRegister = require("../../validates/client/register.validate");
const validateLogin = require("../../validates/client/login.validate");
const validatePassword = require("../../validates/client/forgot-password");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/register", controller.register);
router.post("/register",validateRegister.registerPost ,controller.registerPost);


router.get("/login", controller.login);
router.post("/login",validateLogin.loginPost ,controller.loginPost);

router.get("/logout", controller.logoutPost);

router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot",validatePassword.forgotPasswordPost ,controller.forgotPasswordPost);

router.get("/password/otp/:email", controller.optPassword);
router.post("/password/otp/:email",validatePassword.optPasswordPost ,controller.optPasswordPost);

router.get("/password/reset-password", controller.resetPassword);
router.post("/password/reset-password",validatePassword.resetPasswordPost , controller.resetPasswordPost);

router.get("/info",authMiddleware.requireAuth ,controller.info);

module.exports = router;