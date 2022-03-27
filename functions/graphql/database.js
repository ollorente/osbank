// @ts-check
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB || "mongodb://localhost:27017/osBankDev", {})
  .then(() => console.log(`>>> [DB] is connected... <<<`))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`));

module.exports = mongoose;
