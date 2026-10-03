const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const env = require("dotenv");

env.config();
app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.status(201).send("Assalamualaikum! This is an Authentication CRUD.");
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Authentication CRUD running.")
});