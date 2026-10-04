const Joi = require("joi");
const { pwdRegex } = require("../lib/regex/auth.regex");

const signupSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).pattern(pwdRegex).required().messages({
        "string.pattern.base":
            "Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    })
}).required();

const signinSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}).required();

const forgotPwdSchema = Joi.object({
    email: Joi.string().email().required()
}).required();

const otpSchema = Joi.object({
    otp: Joi.string().length(6).required()
}).required();

const newPwdSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(15).pattern(pwdRegex).required().messages({
        "string.pattern.base":
            "Password must be 8 to 15 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    }),
    otp: Joi.string().length(6).required()
}).required();


const authSchema = {
    signupSchema,
    signinSchema,
    forgotPwdSchema,
    otpSchema,
    newPwdSchema
};



module.exports = authSchema;