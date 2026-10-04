const { Router } = require("express");
const validationPipe = require("../lib/middlewares/validation.middleware");
const { signupSchema } = require("../validations/auth.validation");
const { createUser } = require("../services/auth.service");


const router = Router();

router.post("/signup", validationPipe(signupSchema), (req, res) => createUser(req.body, res));


module.exports = { router };