const { Router } = require("express");
const validationPipe = require("../lib/middlewares/validation.middleware");
const { signupSchema, signinSchema, forgotPwdSchema, otpSchema, newPwdSchema } = require("../validations/auth.validation");
const { signup, login, forgotPwd, verifyOtp, resetPwd } = require("../controllers/auth.controller");


const router = Router();

router.post("/signup", validationPipe(signupSchema), signup);

router.post("/login", validationPipe(signinSchema), login);

router.post("/forgotPwd", validationPipe(forgotPwdSchema), forgotPwd);

router.post("/verifyOtp", validationPipe(otpSchema), verifyOtp);

router.put("/resetPwd", validationPipe(newPwdSchema), resetPwd);


module.exports = { router };