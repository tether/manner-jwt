
/**
 * Test dependencies.
 */

const test = require('tape')
const jwt = require('jsonwebtoken')
const server = require('server-test')
const concat = require('concat-stream')
const manner = require('..')


test('should call service if token is decrypted', assert => {
  assert.plan(1)
  const service = manner({
    get: () => {
      return 'hello world!'
    }
  })
  const token = jwt.sign({
    name: 'foo'
  }, process.env.JWT_SECRET)
  server((req, res) => {
    const input = service(req, res)
    input.pipe(concat(data => {
      assert.equal(data, 'hello world!')
    }))
    input.pipe(res)
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, true)
})


test('should mix jwt payload into request query property', assert => {
  assert.plan(1)
  const service = manner({})
  const token = jwt.sign({
    name: 'foo'
  }, process.env.JWT_SECRET)
  server((req, res) => {
    service(req, res).pipe(res)
    assert.equal(req.query.name, 'foo')
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, true)
})

test('should return uauthorized payload if token is not verified', assert => {
  assert.plan(1)
  const service = manner({
    get: () => {
      return 'hello world!'
    }
  })
  const token = jwt.sign({
    name: 'foo'
  }, 'youhouu')
  server((req, res) => {
    const input = service(req, res).on('end', () => {
      assert.equal(res.statusCode, 403)
    })
    input.pipe(res)
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, true)
})
