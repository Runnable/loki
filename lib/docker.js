'use strict'

const Promise = require('bluebird')
const Dockerode = require('dockerode')
const BaseDockerClient = require('./base')

Promise.promisifyAll(Dockerode)
Promise.promisifyAll(Dockerode.prototype)

/**
 * Base Docker client with batteries. Can be extended
 * @param {Object} opts - docker options
 * @class
 * @extends loki:Base
 * @author Anton Podviaznikov
 */
class Docker extends BaseDockerClient {

  constructor (opts) {
    super(Dockerode, opts)
  }
}

module.exports = Docker
