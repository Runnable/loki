'use strict'

const Swarmerode = require('swarmerode')
const Dockerode = require('dockerode')
const SwarmedDockerode = Swarmerode(Dockerode)

const BaseDockerClient = require('./base')

/**
 * Base Swarm client with batteries. Can be extended
 * @param {Object} opts - docker options
 * @class
 * @extends docker-girl:Swarm
 * @author Anton Podviaznikov
 */
class Swarm extends BaseDockerClient {

  constructor (opts) {
    super(SwarmedDockerode, opts)
  }
}

module.exports = Swarm
