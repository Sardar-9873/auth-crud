const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../lib/helpers/db.helper");
const sendMail = require("../lib/helpers/email.helper");
const { OnBoard, SignIn, ForgotPwd, ResetPwd } = require("../emails/auth.template");
const { OTP } = require("otplib");
const minsToMilliseconds = require("../lib/helpers/minsToMilliseconds.helper");

const createUser = async (body, res) => {
    const { email, password } = body;
    const user = await getDB().collection("users").findOne({ email });
    if (user) {
        return res.status(409).send({
            data: null,
            message: "Email already exist.",
            error: true
        });
    } else {
        const hashedPwd = await bcrypt.hash(password, 10);
        await getDB()
            .collection("users")
            .insertOne({
                email: email, password: hashedPwd
            });
            res.status(201).send({
                data: null,
                message: "Congrats! User created successfully.",
                error: false
            });
            await sendMail({ to: email, subject: OnBoard.subject, text: OnBoard.text });
    }
};

const getUser = async (body, res) => {
    const { email, password } = body;
    const user = await getDB().collection("users").findOne({ email });
    if (!user) {
        return res.status(400).send({
            data: null,
            message: "Credentials not found.",
            error: true
        });
    } else {
        const isPwdMatched = await bcrypt.compare(password, user.password);
        if (!isPwdMatched) {
            return res.status(400).send({
                data: null,
                message: "Credentials not found.",
                error: true
            });
        } else {
            const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY);
            res.status(200).send({
                data: token,
                message: "User logged In successfully.",
                error: false
            });
            await sendMail({ to: user.email, subject: SignIn.subject, text: SignIn.text });
        }
    }
};

const requestPasswordReset = async (body, res) => {
    const { email } = body;
    const user = await getDB().collection("users").findOne({ email });

    if (!user) {
        return res.status(400).send({
            data: null,
            message: "Invalid email.",
            error: true
        });
    } else {
        const otp = new OTP();

        const secret = otp.generateSecret();
        // console.log(secret, "==>>SECRET<<==");

        const token = await otp.generate({ secret });
        // console.log(token, "==>>TOKEN<<==");

        await getDB().collection("otps").insertOne({
            email,
            token,
            secret,
            createdAt: Date.now(),
        });

        res.status(200).send({
            data: null,
            message: `Mail containing OTP sent to <${email}>.`,
            error: false
        });
        await sendMail({ to: email, subject: ForgotPwd.subject, text: ForgotPwd.text(token) });
    }
};

const verifyResetOtp = async (body, res) => {
    const { otp } = body;

    const isOTPExisting = await getDB().collection("otps").findOne({ token: otp });

    if (!isOTPExisting) {
        return res.status(400).send({
            data: null,
            message: "OTP does not exist.",
            error: true
        });
    } else {
        const isOtpExpiredOrNot = isOTPExpired(isOTPExisting.createdAt, minsToMilliseconds(5));
        if (isOtpExpiredOrNot) {
            await getDB().collection("otps").deleteOne({ _id: isOTPExisting._id })
            return res.status(400).send({
                data: null,
                message: "OTP has been expired.",
                error: true
            });
        } else {
            await getDB().collection("otps").updateOne({ token: otp }, { $set: { verifiedAt: Date.now() } });
            res.status(200).send({
                data: null,
                message: "OTP verified now reset your password.",
                error: false
            });
        }
    }
};

const resetPassword = async (body, res) => {
    const { email, password, otp } = body;

    const isOTPExisting = await getDB().collection("otps").findOne({ token: otp, email: email });

    if (!isOTPExisting) {
        return res.status(400).send({
            data: null,
            message: "Credentials not found.",
            error: true
        });
    } else {
        const isOTPExpiredOrNot = isOTPExpired(isOTPExisting?.verifiedAt, minsToMilliseconds(5));

        if (isOTPExpiredOrNot) {
            await getDB().collection("otps").deleteOne({ _id: isOTPExisting._id });
            return res.status(400).send({
                data: null,
                message: "OTP has been expired.",
                error: true
            });
        } else {
            const hashedPwd = await bcrypt.hash(password, 10);
            await getDB().collection("users").updateOne({ email }, { $set: { password: hashedPwd } });
            await getDB().collection("otps").deleteOne({ _id: isOTPExisting?._id });
            res.status(200).send({
                data: null,
                message: "Congrats! Your Password has been updated.",
                error: false
            });
            await sendMail({to: email, subject: ResetPwd.subject, text: ResetPwd.text});
        }
    }
};

const isOTPExpired = (createdAtInMS, expiryDurationInMS) => {
    return Date.now() - createdAtInMS >= expiryDurationInMS;
};



const authServices = {
    createUser,
    getUser,
    requestPasswordReset,
    verifyResetOtp,
    resetPassword
};

module.exports = authServices;

