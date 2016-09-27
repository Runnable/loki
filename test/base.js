'use strict'

const Dockerode = require('dockerode')
const chai = require('chai')
chai.use(require('chai-as-promised'))
const assert = chai.assert
const sinon = require('sinon')
const BaseClient = require('../lib/index')._BaseClient

describe('Base Client', function () {
  describe('constructor', () => {
    it('should throw if Driver class is empty', (done) => {
      /* eslint-disable no-new */
      assert.throws(() => {
        new BaseClient()
      }, Error, '"docker driver" is required')
      /* eslint-disable no-new */
      done()
    })
    it('should throw if Driver class is not a function', (done) => {
      /* eslint-disable no-new */
      assert.throws(() => {
        new BaseClient(1)
      }, Error, '"docker driver" must be a Function')
      /* eslint-disable no-new */
      done()
    })
    describe('createClient', function () {
      beforeEach((done) => {
        sinon.stub(BaseClient, 'createClient')
        done()
      })
      afterEach((done) => {
        BaseClient.createClient.restore()
        done()
      })
      it('should pass datadogTags to the createClient', (done) => {
        const opts = {
          targetType: 'docker',
          host: 'http://10.0.0.8:4242',
          serviceName: 'api',
          datadogTags: {
            org: 777
          }
        }
        const client = new BaseClient(Dockerode, opts)
        sinon.assert.calledOnce(BaseClient.createClient)
        sinon.assert.calledWith(BaseClient.createClient, Dockerode,
          sinon.match.object, {
            datadogTags: { org: 777 },
            host: undefined,
            port: undefined,
            service: 'api',
            targetType: 'docker'
          }
        )
        assert.isNotNull(client.client)
        done()
      })
    })
  })
})
