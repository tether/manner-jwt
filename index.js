/**
 * Dependencies
 */

const manner = require('manner')
const jwt = require('jsonwebtoken')


/**
 * This is a simple description.
 *
 * @param {String} path
 * @param {String?} secret
 * @api public
 */

module.exports = function (path, secret = process.env.JWT_SECRET) {
  const service = manner(path)
  return (req, res) => {
    const payload = token(req)
    if (payload) {
      const obj = jwt.verify(payload, secret)
      if (obj) {
        req.query = Object.assign(req.query || {}, obj)
        return service(req, res)
      }
    }
  }
}


/**
 * Extract token from authorization header.
 *
 * @param {httpIncomingMessage} req
 * @return {String} (or undefined)
 * @api private
 */

function token(req) {
  const authorization = req.headers.authorization.split(' ')
  if (authorization[0] === 'Bearer' && authorization.length === 2) return authorization[1]
}
