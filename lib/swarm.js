'use strict'

const Promise = require('bluebird')
const Swarmerode = require('swarmerode')
const Dockerode = require('dockerode')
const SwarmedDockerode = Swarmerode(Dockerode)

const BaseDockerClient = require('./base')


Promise.promisifyAll(Dockerode)
Promise.promisifyAll(Dockerode.prototype)
Promise.promisifyAll(SwarmedDockerode)
Promise.promisifyAll(SwarmedDockerode.prototype)


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
const swarmFuncs = allSwarmFuncs.filter(function (func) {
  return func !== 'constructor'
})
swarmFuncs.forEach((key) => {
  Swarm.prototype[key] = function () {
    const args = Array.from(arguments)
    this.client[key].apply(this, args)
  }
})

module.exports = Swarm
