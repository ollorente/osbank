// @ts-check
// @ts-ignore
const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB, {})
  .then(() => console.log('>>> [DB] is connected... <<<'))
  .catch((error) => console.log(`<<< [ERROR]: ${error} >>>`))

module.exports = mongoose
