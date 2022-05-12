// @ts-check
require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const serverless = require('serverless-http')
// @ts-ignore
const { error404, errorHandler } = require('./middlewares')

const app = express()

app.use(cors())
// @ts-ignore
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/.netlify/functions/api', require('./v1/routes'))

app.use(error404)
app.use(errorHandler)

module.exports.handler = serverless(app)
