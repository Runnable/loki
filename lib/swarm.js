'use strict'

const Promise = require('bluebird')
const Swarmerode = require('swarmerode')
const SwarmerodeClass = Swarmerode._Swarmerode
const Dockerode = require('dockerode')
const SwarmedDockerode = Swarmerode(Dockerode)

const BaseDockerClient = require('./base')

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
 * Import all the Swarmerode.prototype method and Ponosify them
 */
const allSwarmFuncs = Object.getOwnPropertyNames(SwarmerodeClass.prototype)
// clone array without first item which is constructor
const swarmFuncs = allSwarmFuncs.slice(1)
swarmFuncs.forEach((key) => {
  Swarm.prototype[key] = function () {
    const args = Array.from(arguments)
    return Promise.fromCallback((cb) => {
      args.push(cb)
      this.client[key].apply(this, args)
    })
  }
})

module.exports = Swarm
