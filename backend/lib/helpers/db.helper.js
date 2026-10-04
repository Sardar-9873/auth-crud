const env = require("dotenv");
const dns = require("node:dns");
const { MongoClient } = require("mongodb");

env.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const client = new MongoClient(process.env.CLOUD_DB_URI);

let db;

async function connectToDB() {
    try {
        await client.connect();
        db = client.db("app");
        console.log("Database Connected.");
    } catch (err) {
        console.log(err);
    }
}

function getDB() {
    if (!db) {
        console.log("Database not connected yet, First call connectToDB then call getDB.");
        return;
    } else {
        return db;
    }
}

async function disconnectFromDB() {
    await client.close();
}

const dbFunctions = {
    connectToDB,
    getDB,
    disconnectFromDB
}

module.exports = dbFunctions;
