/**
 * Dependencies
 */

const manner = require('manner')
const folder = require('manner-folder')
const jwt = require('jsonwebtoken')
const salute = require('salute')
const error = require('http-errors')


/**
 * Create manner service when bearer token is
 * verified.
 *
 * @param {String} path
 * @param {String?} secret
 * @api public
 */

module.exports = function (path, secret = process.env.JWT_SECRET) {
  const service = typeof path === 'string'
      ? folder(path)
      : manner(path)
  return (req, res) => {
    const payload = token(req)
    if (payload) {
      let obj
      try {
        obj = jwt.verify(payload, secret)
        req.query = Object.assign(req.query || {}, obj)
        return service(req, res)
      } catch (e) {
        // not verified
      }
    }
    return salute(() => error(403, 'Not Authorized'))(req, res)
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
