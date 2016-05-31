'use strict'

const Promise = require('bluebird')
const Dockerode = require('dockerode')
const BaseDockerClient = require('./base')

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

/**
 * Import all the Swarmerode.prototype methods: cps and promised based
 */
const allDockerFuncs = Object.getOwnPropertyNames(Dockerode.prototype)
// clone array without constructor
const dockerFuncs = allDockerFuncs.filter((func) => {
  return func !== 'constructor'
})
dockerFuncs.forEach((key) => {
  // put every function from Dockerode into the `Docker.prototype`
  Docker.prototype[key] = function () {
    const args = Array.from(arguments)
    return this.client[key].apply(this.client, args)
  }
  // promisify every function from Dockerode and put it into the `Docker.prototype`
  Docker.prototype[key + BaseDockerClient.PROMISIFIED_SUFFIX] = Promise.promisify(Docker.prototype[key])
})

module.exports = Docker
