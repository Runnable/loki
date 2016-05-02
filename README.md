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

You can use loki Docker client Promisified extra container functions like this:

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.stopContainerAsync('71501a8ab0f8')
    .then(function () {
      console.log('container stopped')
    })
    .catch(function (err) {
      console.log('container failed to stop', err)
    })

```

You can use loki Dockerode client methods like this:

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.getContainer('71501a8ab0f8')
    .stop(function (err) {
      if (err) {
        return console.log('container failed to stop', err)
      }
      console.log('container stopped')
    })
```

You can use loki Dockerode promisified methods directly like this:

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.getContainer('71501a8ab0f8').stopAsync()
    .then(function () {
      console.log('container stopped')
    })
```

You can extend loki Docker client with your app specific functions:

```javascript
  const Docker  = require('loki').Docker

  class MyDocker extends Docker {


  }

  const myDocker = new MyDocker()
  dockerClient.stopContainerAsync('71501a8ab0f8')
    .then(function () {
      console.log('container stopped')
    })
    .catch(function (err) {
      console.log('container failed to stop', err)
    })
```


## Base functions

Every Loki client include utility Promise-based functions
to deal with containers.

E.x. instead of this code

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.getContainer('71501a8ab0f8')
    .stop(function (err) {
      console.log('stopped container?', err)
    })

```

You can do following

```javascript
  const Docker  = require('loki').Docker

  const dockerClient = new Docker({ host: 'https://127.0.0.1:4242'})
  dockerClient.stopContainerAsync('71501a8ab0f8')
    .then(function () {
      console.log('container was stopped')
    })

```

  - topContainerAsync
  - startContainerAsync
  - commitContainerAsync
  - inspectContainerAsync
  - stopContainerAsync
  - pauseContainerAsync
  - unpauseContainerAsync
  - restartContainerAsync
  - resizeContainerAsync
  - attachContainerAsync
  - removeContainerAsync
  - copyContainerAsync
  - killContainerAsync
  - execContainerAsync
  - renameContainerAsync
  - logContainerAsync
  - statsContainerAsync
  - getArchiveContainerAsync
  - infoArchiveContainerAsync
  - putArchiveContainerAsync
  - updateContainerAsync


## Swarm functions

  - swarmHosts
  - swarmInfo
  - swarmHostExists


## Conventions

 * Each client instance has all functions from Dockerode client available to directly.
 * Each client instance has Promisified Dockerode functions available with `Async` suffix.
 * Each Swarm client instance has all functions from Swarmerode client available to directly.
 * Each Swarm client instance has Promisified Swarmerode functions available with `Async` suffix.
