// @ts-check
// @ts-ignore
const JWT = require('jsonwebtoken')

module.exports = function (headers) {
  const token = headers.authorization
  if (!token) throw new Error('Access denied')

  try {
    const bearer = token.split(' ')[1]
    const verified = JWT.verify(bearer, process.env.SECRET_KEY)

    return verified
  } catch (error) {
    console.log(error)
    throw new Error('Invalid token')
  }
}
