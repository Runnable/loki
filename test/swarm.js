'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
const Swarm = require('../index').Swarm

describe('Swarm', function () {
  describe('constructor', () => {
    /*eslint-disable no-new */
    it('should thow if options are empty', (done) => {
      assert.throws(() => {
        new Swarm()
      }, Error, 'Options are not defined')
      done()
    })

    it('should thow if host is not defined', (done) => {
      assert.throws(() => {
        new Swarm({})
      }, Error, 'Docker host is not defined')
      done()
    })

    it('should thow if serviceNae is not defined', (done) => {
      assert.throws(() => {
        new Swarm({ host: 'https://10.0.0.1:4242' })
      }, Error, 'Service name is not defined')
      done()
    })

    it('should thow if host is invalid', (done) => {
      assert.throws(() => {
        new Swarm({ host: 213123, serviceName: 'loki' })
      }, Error, 'Parameter \'url\' must be a string, not number')
      done()
    })

    it('should setup docker', (done) => {
      let swarm
      assert.doesNotThrow(() => {
        swarm = new Swarm({ host: 'https://10.0.0.1:4242', serviceName: 'loki' })
      })
      assert.instanceOf(swarm.client, Dockerode)
      done()
    })
    /*eslint-disable no-new */
  })
})
