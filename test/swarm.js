'use strict'

const Promise = require('bluebird')
const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const sinon = require('sinon')
require('sinon-as-promised')(Promise)
const Dockerode = require('dockerode')
const SwarmerodeClass = require('swarmerode')._Swarmerode
const BaseClient = require('../lib/index')._BaseClient
const Swarm = require('../lib/index').Swarm

describe('Swarm', function () {
  describe('constructor', () => {
    /*eslint-disable no-new */
    it('should throw if options are empty', (done) => {
      assert.throws(() => {
        new Swarm()
      }, Error, '"host" is required')
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

    it('should throw if timeout is not a number', (done) => {
      assert.throws(() => {
        new Swarm({ host: 'https://10.0.0.1:4242', serviceName: 'loki', timeout: 'abc' })
      }, Error, '"timeout" must be a number')
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
      assert.equal(Object.keys(Dockerode.prototype).length, 27)
      assert.equal(Object.keys(Swarm.prototype).length, 54)
      done()
    })

    it('should have all swarmerode functions available', function (done) {
      Object.keys(SwarmerodeClass.prototype).forEach(function (func) {
        assert.include(Object.keys(Swarm.prototype), func)
      })
      assert.equal(Object.keys(SwarmerodeClass.prototype).length, 3)
      assert.equal(Object.keys(Swarm.prototype).length, 54)
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
      assert.equal(utilityFunctions.length, 20)
      utilityFunctions.forEach(function (func) {
        assert.isDefined(swarm[func])
      })
      done()
    })

    describe('promises', function () {
      let container = {
        kill: function (opts, cb) {
          return cb()
        }
      }
      beforeEach(function (done) {
        sinon.stub(Dockerode.prototype, 'getContainer').returns(container)
        sinon.spy(container, 'kill')
        done()
      })

      afterEach(function (done) {
        Dockerode.prototype.getContainer.restore()
        container.kill.restore()
        done()
      })

      it('should make utility functions as promises', function (done) {
        const swarm = new Swarm({
          host: 'https://10.0.0.1:4242',
          serviceName: 'loki',
          timeout: 2000
        })
        swarm.killContainerAsync(1, {}).asCallback(done)
      })

      it('should options should be optional', function (done) {
        const swarm = new Swarm({
          host: 'https://10.0.0.1:4242',
          serviceName: 'loki',
          timeout: 2000
        })
        swarm.killContainerAsync(1).asCallback(done)
      })
    })
  })

  describe('inherited promisified functions', function () {
    let dockerodeFuncs = Object.keys(Dockerode.prototype)
    beforeEach(function (done) {
      dockerodeFuncs.forEach(function (func) {
        sinon.stub(Dockerode.prototype, func).yieldsAsync(null, {})
      })
      done()
    })

    afterEach(function (done) {
      dockerodeFuncs.forEach(function (func) {
        Dockerode.prototype[func].restore()
      })
      done()
    })

    it('should be still promisified', function (done) {
      const swarm = new Swarm({
        host: 'https://10.0.0.1:4242',
        serviceName: 'loki',
        timeout: 2000
      })
      swarm.pingAsync().asCallback(done)
    })

    it('should have promisified swarmerode functions', function (done) {
      const swarm = new Swarm({
        host: 'https://10.0.0.1:4242',
        serviceName: 'loki',
        timeout: 2000
      })
      swarm.swarmInfoAsync().asCallback(done)
    })

    it('should have promise for each original Dockerode function', function (done) {
      const swarm = new Swarm({
        host: 'https://10.0.0.1:4242',
        serviceName: 'loki',
        timeout: 2000
      })
      const promises = dockerodeFuncs.map(function (func) {
        return swarm[func + BaseClient.PROMISIFIED_SUFFIX]
      })
      assert.equal(promises.length, 27)
      Promise.all(promises).asCallback(done)
    })
  })
})
