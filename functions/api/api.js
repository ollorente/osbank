// @ts-check
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const serverless = require("serverless-http");
const { error404, errorHandler } = require("./middlewares");

const app = express();
require("./db");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/.netlify/functions/api", require("./routes"));

app.use(error404);
app.use(errorHandler);

module.exports.handler = serverless(app);
