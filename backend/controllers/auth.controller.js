const { createUser, getUser, requestPasswordReset, verifyResetOtp, resetPassword } = require("../services/auth.service");

const signup = (req, res) => createUser(req.body, res);
const login = (req, res) => getUser(req.body, res);
const forgotPwd = (req, res) => requestPasswordReset(req.body, res);
const verifyOtp = (req, res) => verifyResetOtp(req.body, res);
const resetPwd = (req, res) => resetPassword(req.body, res);

const authControllers = {
    signup,
    login,
    forgotPwd,
    verifyOtp,
    resetPwd
};

module.exports = authControllers;