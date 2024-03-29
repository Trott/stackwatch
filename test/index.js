const Code = require('@hapi/code')

const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()

const expect = Code.expect
const describe = lab.experiment
const it = lab.test
const afterEach = lab.afterEach

const rewire = require('rewire')
const stackwatch = rewire('../index.js')

let reset

const noop = function () {}

describe('exports', function () {
  it('should expose check()', function (done) {
    expect(stackwatch.check).to.be.a.function()
  })

  it('should expose start()', function (done) {
    expect(stackwatch.start).to.be.a.function()
  })

  it('should expose stop()', function (done) {
    expect(stackwatch.stop).to.be.a.function()
  })
})

describe('check()', function () {
  afterEach(function (done) {
    if (reset) {
      reset()
      reset = null
    }
  })

  it('should run a callback', function (done) {
    reset = stackwatch.__set__('context', {
      questions: {
        questions: function (filter, callback) {
          return process.nextTick(function () {
            callback(null, { items: [{ question_id: 'fhqwhgads', link: 'https://www.example.com/' }] })
          })
        }
      }
    })

    const verify = function (err, data) {
      expect(err).to.be.null()
      expect(data).to.be.an.object()
    }
    stackwatch.check({}, verify)
  })

  it('should filter on provided tag in options', function (done) {
    reset = stackwatch.__set__('context', {
      questions: {
        questions: function (filter) {
          expect(filter.tagged).to.equal('html5')
        }
      }
    })

    stackwatch.check({ tag: 'html5' }, noop)
  })
})

describe('start()', function () {
  afterEach(function (done) {
    if (reset) {
      reset()
      reset = null
    }
  })

  it('should return an object', function (done) {
    reset = stackwatch.__set__('context', {
      questions: {
        questions: noop
      }
    })

    const timer = stackwatch.start({}, function () {})
    expect(timer).to.be.an.object()
    stackwatch.stop(timer)
  })

  it('should not permit wait to be set under 60', function (done) {
    reset = stackwatch.__set__({
      context: {
        questions: {
          questions: function (filter, callback) {
            return process.nextTick(function () {
              callback(null, { items: [{ question_id: 'fhqwhgads', link: 'https://www.example.com/' }] })
            })
          }
        }
      },
      setInterval: function (func, delay) {
        expect(delay).to.equal(60000)
      }
    })

    stackwatch.start({ wait: 0 }, noop)
  })

  it('should set wait option to 60 seconds if no wait option provided', function (done) {
    reset = stackwatch.__set__({
      context: {
        questions: {
          questions: function (filter, callback) {
            return process.nextTick(function () {
              callback(null, { items: [{ question_id: 'fhqwhgads', link: 'https://www.example.com/' }] })
            })
          }
        }
      },
      setInterval: function (func, delay) {
        expect(delay).to.equal(60000)
      }
    })

    stackwatch.start({}, noop)
  })

  it('should correctly parse a string wait option', function (done) {
    reset = stackwatch.__set__({
      context: {
        questions: {
          questions: function (filter, callback) {
            return process.nextTick(function () {
              callback(null, { items: [{ question_id: 'fhqwhgads', link: 'https://www.example.com/' }] })
            })
          }
        }
      },
      setInterval: function (func, delay) {
        expect(delay).to.equal(120000)
      }
    })

    stackwatch.start({ wait: '120' }, noop)
  })
})

describe('stop()', function () {
  it('should be an alias for clearInterval', function (done) {
    expect(stackwatch.stop === clearInterval).to.be.true()
  })
})
