'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const BaseClient = require('../lib/index')._BaseClient

describe('Base Client', function () {
  describe('constructor', () => {
    /*eslint-disable no-new */
    it('should throw if Driver class is empty', (done) => {
      assert.throws(() => {
        new BaseClient()
      }, Error, '"docker driver" is required')
      done()
    })
    it('should throw if Driver class is not a function', (done) => {
      assert.throws(() => {
        new BaseClient(1)
      }, Error, '"docker driver" must be a Function')
      done()
    })
    /*eslint-disable no-new */
  })
})
