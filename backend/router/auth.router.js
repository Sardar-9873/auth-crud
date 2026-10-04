const { Router } = require("express");
const validationPipe = require("../lib/middlewares/validation.middleware");
const { signupSchema, signinSchema } = require("../validations/auth.validation");
const { createUser, getUser } = require("../services/auth.service");


const router = Router();

router.post("/signup", validationPipe(signupSchema), (req, res) => createUser(req.body, res));

router.post("/login", validationPipe(signinSchema), (req, res) => getUser(req.body, res));


module.exports = { router };