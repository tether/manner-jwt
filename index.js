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
    const token = ''
    const obj = jwt.verify(token, secret)
    if (obj) return service(req, res)
  }
}
