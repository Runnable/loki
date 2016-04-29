/**
 * Docker client model
 * @module lib/index
 */
'use strict'

const Promise = require('bluebird')
const defaults = require('101/defaults')
const dogerode = require('dogerode')
const assign = require('101/assign')
const fs = require('fs')
const join = require('path').join
const url = require('url')

const logger = require('./logger')

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


/**
 * Base Docker/Swarm client with batteries. Can be extended
 * @param {Class} DriverClass docker driver class
 * @param {Object} opts - docker options
 * @class
 * @extends loki:base
 * @author Anton Podviaznikov
 */
class BaseDockerClient {

  constructor (DriverClass, opts) {
    if (!DriverClass) {
      throw new Error('Docker driver class is not defined')
    }
    if (!opts) {
      throw new Error('Options are not defined')
    }
    const dockerHost = opts.host
    if (!dockerHost) {
      throw new Error('Docker host is not defined')
    }
    const serviceName = opts.serviceName || process.env.APP_NAME
    if (!serviceName) {
      throw new Error('Service name is not defined')
    }
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
      port: this.port,
      timeout: process.env.DOCKER_TIMEOUT
    })
    assign(dockerodeOpts, certs)
    const datadogOpts = {
      service: serviceName,
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
    return Promise.fromCallback((cb) => {
      container[action](opts, (err) => {
        if (err) {
          const message = 'Container action ' + action + ' failed'
          err.data = {
            message: message,
            opts: opts,
            containerId: containerId
          }
          log.error({ err: err }, 'container action error')
          return cb(err)
        }
        log.trace('container action success')
        cb.apply(this, arguments)
      })
    })
  }
}

containerActions.forEach((actionName) => {
  const functionName = actionName + 'Container'
  BaseDockerClient.prototype[functionName] = function (containerId, opts) {
    return this._containerAction(containerId, actionName, opts)
  }
})

module.exports = BaseDockerClient
