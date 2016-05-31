'use strict'

const Promise = require('bluebird')
const Swarmerode = require('swarmerode')
const Dockerode = require('dockerode')
const SwarmedDockerode = Swarmerode(Dockerode)

const BaseDockerClient = require('./base')

/**
 * Base Swarm client with batteries. Can be extended
 * @param {Object} opts - docker options
 * @class
 * @extends loki:Base
 * @author Anton Podviaznikov
 */
class Swarm extends BaseDockerClient {

  constructor (opts) {
    super(SwarmedDockerode, opts)
  }
}

/**
 * Import all the Swarmerode.prototype methods: cps and promised based
 */
const allSwarmFuncs = Object.getOwnPropertyNames(SwarmedDockerode.prototype)
// clone array without constructor
const swarmFuncs = allSwarmFuncs.filter((func) => {
  return func !== 'constructor'
})

swarmFuncs.forEach((key) => {
  // put every function from Dockerode into the `Docker.prototype`
  Swarm.prototype[key] = function () {
    const args = Array.from(arguments)
    return this.client[key].apply(this.client, args)
  }
  // promisify every function from Dockerode and put it into the `Docker.prototype`
  Swarm.prototype[key + BaseDockerClient.PROMISIFIED_SUFFIX] = Promise.promisify(Swarm.prototype[key])
})

module.exports = Swarm
