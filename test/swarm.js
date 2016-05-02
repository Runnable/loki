'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
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
})
