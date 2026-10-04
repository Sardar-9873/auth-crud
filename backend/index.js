const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const env = require("dotenv");
const { connectToDB } = require("./lib/helpers/db.helper");
const { router } = require("./router/auth.router");

env.config();
app.use(bodyparser.json());
app.use("/api/auth", router);

app.get("/", (req, res) => {
    res.status(200).send("Assalamualaikum! This is an Authentication CRUD.");
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Authentication CRUD running.");
    connectToDB();
});