'use strict'

const Dockerode = require('dockerode')
const BaseDockerClient = require('./base')

/**
 * Base Docker client with batteries. Can be extended
 * @param {Object} opts - docker options
 * @class
 * @extends docker-girl:Docker
 * @author Anton Podviaznikov
 */
class Docker extends BaseDockerClient {

  constructor (opts) {
    super(Dockerode, opts)
  }
}

module.exports = Docker
