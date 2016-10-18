'use strict'

const chai = require('chai')
const assert = chai.assert

const utils = require('../../lib/utils')

describe('utils unit test', () => {
  describe('toDockerHost', () => {
    it('should convert url to host', (done) => {
      assert.equal(utils.toDockerHost('http://10.0.0.1:4242'), '10.0.0.1:4242')
      done()
    })

    it('should return same valid host', (done) => {
      assert.equal(utils.toDockerHost('10.0.0.1:4242'), '10.0.0.1:4242')
      done()
    })
  })

  describe('toDockerUrl', () => {
    it('should convert host to url', (done) => {
      assert.equal(utils.toDockerUrl('10.0.0.1:4242'), 'http://10.0.0.1:4242')
      done()
    })

    it('should return same valid url', (done) => {
      assert.equal(utils.toDockerUrl('http://10.0.0.1:4242'), 'http://10.0.0.1:4242')
      done()
    })
  })
})
