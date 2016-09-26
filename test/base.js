'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const BaseClient = require('../lib/index')._BaseClient

describe('Base Client', function () {
  describe('constructor', () => {
    it('should throw if Driver class is empty', (done) => {
      /* eslint-disable no-new */
      assert.throws(() => {
        new BaseClient()
      }, Error, '"docker driver" is required')
      /* eslint-disable no-new */
      done()
    })
    it('should throw if Driver class is not a function', (done) => {
      /* eslint-disable no-new */
      assert.throws(() => {
        new BaseClient(1)
      }, Error, '"docker driver" must be a Function')
      /* eslint-disable no-new */
      done()
    })
  })
})
