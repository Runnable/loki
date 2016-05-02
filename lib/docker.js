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

/**
 * Import all the Swarmerode.prototype methods: cps and promised based
 */
const allDockerFuncs = Object.getOwnPropertyNames(Dockerode.prototype)
// clone array without constructor
const dockerFuncs = allDockerFuncs.filter(function (func) {
  return func !== 'constructor'
})
dockerFuncs.forEach((key) => {
  Docker.prototype[key] = function () {
    const args = Array.from(arguments)
    this.client[key].apply(this, args)
  }
})

module.exports = Docker
