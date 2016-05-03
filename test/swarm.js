'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
const Swarmerode = require('swarmerode')
const BaseClient = require('../index')._BaseClient
const Swarm = require('../index').Swarm

describe('Swarm', function () {
  describe('constructor', () => {
    /*eslint-disable no-new */
    it('should throw if options are empty', (done) => {
      assert.throws(() => {
        new Swarm()
      }, Error, '"docker opts" is required')
      done()
    })

    it('should throw if host is not defined', (done) => {
      assert.throws(() => {
        new Swarm({})
      }, Error, '"host" is required')
      done()
    })

    it('should throw if serviceName is not defined', (done) => {
      assert.throws(() => {
        new Swarm({ host: 'https://10.0.0.1:4242' })
      }, Error, '"serviceName" is required')
      done()
    })

    it('should throw if host is invalid', (done) => {
      assert.throws(() => {
        new Swarm({ host: 213123, serviceName: 'loki' })
      }, Error, '"host" must be a string')
      done()
    })

    it('should throw if timeout is not defined', (done) => {
      assert.throws(() => {
        new Swarm({ host: 'https://10.0.0.1:4242', serviceName: 'loki' })
      }, Error, '"timeout" is required')
      done()
    })

    it('should setup docker', (done) => {
      let swarm
      assert.doesNotThrow(() => {
        swarm = new Swarm({ host: 'https://10.0.0.1:4242',
        serviceName: 'loki', timeout: 2000 })
      })
      assert.instanceOf(swarm.client, Dockerode)
      done()
    })
    /*eslint-disable no-new */
  })

  describe('inherited functions', function () {

    it('should have all dockerode functions available', function (done) {
      Object.keys(Dockerode.prototype).forEach(function (func) {
        assert.include(Object.keys(Swarm.prototype), func)
      })
      done()
    })

    it('should have all swarmerode functions available', function (done) {
      Object.keys(Swarmerode.prototype).forEach(function (func) {
        assert.include(Object.keys(Swarm.prototype), func)
      })
      done()
    })

    it('should have all utility functions', function (done) {
      const utilityFunctions = BaseClient._containerActions.map(function (action) {
        return action + 'ContainerAsync'
      })
      const swarm = new Swarm({
        host: 'https://10.0.0.1:4242',
        serviceName: 'loki',
        timeout: 2000
      })
      utilityFunctions.forEach(function (func) {
        assert.isDefined(swarm[func])
      })
      done()
    })
  })
})
