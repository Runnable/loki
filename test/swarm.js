'use strict'

const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const Dockerode = require('dockerode')
const Swarm = require('../index').Swarm

describe('Swarm', function () {
  describe('constructor', () => {
    it('should setup docker', (done) => {
      let swarm
      assert.doesNotThrow(() => {
        swarm = new Swarm({ host: 'https://10.0.0.1:4242', serviceName: 'loki' })
      })
      assert.instanceOf(swarm.client, Dockerode)
      done()
    })
  })
})
