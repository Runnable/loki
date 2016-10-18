'use strict'

const chai = require('chai')
const assert = chai.assert

const utils = require('../lib/index').Utils

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

  describe('toDockerIp', () => {
    it('should convert host to ip', (done) => {
      assert.equal(utils.toDockerIp('10.0.0.1:4242'), '10.0.0.1')
      done()
    })

    it('should convert url to ip', (done) => {
      assert.equal(utils.toDockerIp('http://10.0.0.1:4242'), '10.0.0.1')
      done()
    })

    it('should return same valid ip', (done) => {
      assert.equal(utils.toDockerIp('10.0.0.1'), '10.0.0.1')
      done()
    })
  })
})
