/**
 * Base Docker client model
 * @module lib/base
 */
'use strict'

const defaults = require('101/defaults')
const dogerode = require('dogerode')
const assign = require('101/assign')
const fs = require('fs')
const join = require('path').join
const joi = require('joi')
const url = require('url')

const logger = require('./logger')

const PROMISIFIED_SUFFIX = 'Async'
// try/catch is a better pattern for this, since checking to see if it exists
// and then reading files can lead to race conditions (unlikely, but still)
const certs = {}

try {
  // DOCKER_CERT_PATH is docker's default thing it checks - may as well use it
  const certPath = process.env.DOCKER_CERT_PATH || '/etc/ssl/docker'
  certs.ca = fs.readFileSync(join(certPath, '/ca.pem'))
  certs.cert = fs.readFileSync(join(certPath, '/cert.pem'))
  certs.key = fs.readFileSync(join(certPath, '/key.pem'))
} catch (e) {
  throw e
}

const opstSchema = joi.object({
  host: joi.string().required(),
  serviceName: joi.string().required(),
  log: joi.object().unknown(),
  timeout: joi.number().required()
}).unknown().required().label('docker opts')

/**
 * Base Docker/Swarm client with batteries. Can be extended
 * @param {Class} DriverClass docker driver class: Dockerode or Swarmerode
 * @param {Object} opts - docker options
 * @class
 * @author Anton Podviaznikov
 */
class BaseDockerClient {

  constructor (DriverClass, opts) {
    if (!DriverClass) {
      throw new Error('Docker driver class is not defined')
    }
    defaults(opts, {
      serviceName: process.env.APP_NAME,
      timeout: process.env.DOCKER_TIMEOUT
    })
    joi.assert(opts, opstSchema)
    const dockerHost = opts.host
    const libLogger = opts.log || logger
    this.log = libLogger.child({
      dockerHost: dockerHost,
      opts: opts
    })
    this.log.info('Docker constructor')
    const parsed = url.parse(dockerHost)
    this.dockerHost = parsed.protocol + '//' + parsed.host
    this.port = parsed.port
    const dockerodeOpts = defaults(opts, {
      host: this.dockerHost,
      port: this.port
    })
    assign(dockerodeOpts, certs)
    const datadogOpts = {
      service: opts.serviceName,
      host: process.env.DATADOG_HOST,
      port: process.env.DATADOG_PORT
    }
    this.client = dogerode(new DriverClass(dockerodeOpts), datadogOpts)
  }

  /**
   * Function to perform docker action on the Container
   * @param {String} containerId - Container ID
   * @param {String} action - Docker operation like `start`, `logs`, `exec` etc
   * @param {Object} opts - options to pass for the Docker action
   * @return {Promise}
   */
  _containerAction (containerId, action, opts) {
    const logData = {
      containerId: containerId,
      action: action,
      opts: opts
    }
    const log = this.log.child(logData)
    const container = this.client.getContainer(containerId)
    return container[action + PROMISIFIED_SUFFIX]
      .catch((err) => {
        const message = 'Container action ' + action + ' failed'
        err.data = {
          message: message,
          opts: opts,
          containerId: containerId
        }
        log.error({ err: err }, 'container action error')
        throw err
      })
  }
}

const containerActions = [
  'top',
  'start',
  'commit',
  'inspect',
  'stop',
  'pause',
  'unpause',
  'restart',
  'resize',
  'attach',
  'remove',
  'copy',
  'kill',
  'exec',
  'rename',
  'log',
  'stats',
  'getArchive',
  'infoArchive',
  'putArchive',
  'update'
]

containerActions.forEach((actionName) => {
  const functionName = actionName + 'Container' + PROMISIFIED_SUFFIX
  BaseDockerClient.prototype[functionName] = function (containerId, opts) {
    return this._containerAction(containerId, actionName, opts)
  }
})

module.exports = BaseDockerClient
module.exports._containerActions = containerActions
