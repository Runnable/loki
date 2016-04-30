# loki

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Code Climate](https://codeclimate.com/github/Runnable/loki/badges/gpa.svg)](https://codeclimate.com/github/Runnable/loki)


Runnable Docker/Swarm client library with batteries.


![Loki](https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Processed_SAM_loki.jpg/360px-Processed_SAM_loki.jpg)


## Features

   * include both Docker and Swarm clients
   * Swarm client has all additional [swarmerode](https://github.com/Runnable/swarmerode) Promisified methods
   * automatically report each docker call to datadog using [dogerode](https://github.com/Runnable/dogerode)
   * HTTPS certs are required. Will throw an error
   * Base client includes Promisified container actions like `stopContainer`, `logContainer` etc
   * You can still call Dockerode directly. Dockerode instance is available under `client` property


## Usage

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.stopContainer('71501a8ab0f8')
    .then(function () {
      console.log('container stopped')
    })
    .catch(function (err) {
      console.log('container failed to stop', err)
    })

```

## Base functions

  - topContainer
  - startContainer
  - commitContainer
  - inspectContainer
  - stopContainer
  - pauseContainer
  - unpauseContainer
  - restartContainer
  - resizeContainer
  - attachContainer
  - removeContainer
  - copyContainer
  - killContainer
  - execContainer
  - renameContainer
  - logContainer
  - statsContainer
  - getArchiveContainer
  - infoArchiveContainer
  - putArchiveContainer
  - updateContainer


## Swarm function

  - swarmHosts
  - swarmInfo
  - swarmHostExists
