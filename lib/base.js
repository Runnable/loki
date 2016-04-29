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
const put = require('101/put')
const url = require('url')

const monitor = require('monitor-dog')
const logger = require('./logger')

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
  // TODO: decide what to do with logs here
  // log.warn({ err: e }, 'cannot load certificates for docker!!')
  // use all or none - so reset certs here
  console.log('failed to load certs', e)
  certs = {}
}

module.exports = Docker

/**
 * Base Swarm client with batteries. Can be extended
 * @param {Class} DriverClass docker driver class
 * @param {Object} opts - docker options
 * @class
 * @extends docker-girl:base
 * @author Anton Podviaznikov
 */
class Docker  {

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
    const libLogger = this.opts.log || logger
    this.log = libLogger.child({
      dockerHost: dockerHost,
      opts: opts
    })
    this.log.info(this.logData, 'Docker constructor')

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
          return cb(err)
        }
        cb.apply(this, arguments)
      })
    })
  }
}
