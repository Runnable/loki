'use strict'

const url = require('url')

exports.toDockerHost = function (urlStr) {
  return urlStr.replace('http://', '')
}

exports.toDockerUrl = function (host) {
  const ensuredHost = exports.toDockerHost(host)
  return 'http://' + ensuredHost
}

exports.toDockerIp = function (urlStr) {
  const fullUrl = exports.toDockerUrl(urlStr) + ':4242'
  return url.parse(fullUrl).hostname
}
