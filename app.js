const express = require("express");
const app = express();
const textRouter = require("./routes/textRoute");

app.use(express.json());

app.use("/text", textRouter);

module.exports = app;
