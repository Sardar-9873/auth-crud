const bcrypt = require("bcrypt");
const { getDB } = require("../lib/helpers/db.helper");
const sendMail = require("../lib/helpers/email.helper");
const { OnBoard } = require("../emails/auth.template");

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

const authServices = {
    createUser
};

module.exports = authServices;

