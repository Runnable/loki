'use strict'

exports.toDockerHost = function (url) {
  return url.replace('http://', '')
}

exports.toDockerUrl = function (host) {
  const ensuredHost = exports.toDockerHost(host)
  return 'http://' + ensuredHost
}
