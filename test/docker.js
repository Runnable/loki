'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
const Docker = require('../index').Docker

describe('Docker', function () {
  describe('constructor', () => {
    /*eslint-disable no-new */
    it('should thow if options are empty', (done) => {
      assert.throws(() => {
        new Docker()
      }, Error, 'Options are not defined')
      done()
    })

    it('should thow if host is not defined', (done) => {
      assert.throws(() => {
        new Docker({})
      }, Error, 'Docker host is not defined')
      done()
    })

    it('should thow if serviceNae is not defined', (done) => {
      assert.throws(() => {
        new Docker({ host: 'https://10.0.0.1:4242' })
      }, Error, 'Service name is not defined')
      done()
    })

    it('should thow if host is invalid', (done) => {
      assert.throws(() => {
        new Docker({ host: 213123, serviceName: 'loki' })
      }, Error, 'Parameter \'url\' must be a string, not number')
      done()
    })

    it('should setup docker', (done) => {
      let docker
      assert.doesNotThrow(() => {
        docker = new Docker({ host: 'https://10.0.0.1:4242', serviceName: 'loki' })
      })
      assert.instanceOf(docker.client, Dockerode)
      done()
    })
    /*eslint-disable no-new */
  })
})
