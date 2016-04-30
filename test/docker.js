'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
const Docker = require('../index').Docker

describe('Docker', function () {
  describe('constructor', () => {
    it('should setup docker', (done) => {
      let docker
      assert.doesNotThrow(() => {
        docker = new Docker({ host: 'https://10.0.0.1:4242', serviceName: 'loki' })
      })
      assert.instanceOf(docker.client, Dockerode)
      done()
    })
  })
})
