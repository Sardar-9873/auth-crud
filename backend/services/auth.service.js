const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("../lib/helpers/db.helper");
const sendMail = require("../lib/helpers/email.helper");
const { OnBoard, SignIn } = require("../emails/auth.template");

const createUser = async (body, res) => {
    const { email, password } = body;
    const user = await getDB().collection("users").findOne({ email });
    if (user) {
        res.status(409).send({
            data: null,
            message: "Email already exist.",
            error: true
        });
        return;
    } else {
        const hashedPwd = await bcrypt.hash(password, 10);
        await getDB()
            .collection("users")
            .insertOne({
                email: email, password: hashedPwd
            });
        await sendMail({ to: email, subject: OnBoard.subject, text: OnBoard.text });
        res.status(201).send({
            data: null,
            message: "Congrats! User created successfully.",
            error: false
        });
    }
};

const getUser = async (body, res) => {
    const { email, password } = body;
    const user = await getDB().collection("users").findOne({ email });
    if (!user) {
        res.status(400).send({
            data: null,
            message: "Credentials not found.",
            error: true
        });
        return;
    } else {
        const isPwdMatched = await bcrypt.compare(password, user.password);
        if (!isPwdMatched) {
            res.status(400).send({
                data: null,
                message: "Credentials not found.",
                error: true
            });
        } else {
            const token = jwt.sign({ email, id: user.id }, process.env.SECRET_KEY);
            await sendMail({ to: user.email, subject: SignIn.subject, text: SignIn.text });
            res.status(200).send({
                data: token,
                message: "User logged In successfully.",
                error: false
            });
        }
    }
};


const authServices = {
    createUser,
    getUser
};

module.exports = authServices;

