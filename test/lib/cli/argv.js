var Code = require('@hapi/code')

var Lab = require('@hapi/lab')
var lab = exports.lab = Lab.script()

var expect = Code.expect
var describe = lab.experiment
var it = lab.test
var beforeEach = lab.beforeEach

var rewire = require('rewire')
var argv = rewire('../../../lib/cli/argv')

describe('argv', function () {
  describe('help', function () {
    var checkForUsage = function (txt) {
      expect(txt.indexOf('Usage:')).to.equal(0)
    }

    it('should print help message with --help', function (done) {
      argv({ _: [], help: true }, checkForUsage)
    })

    it('should print help message with -h', function (done) {
      argv({ _: [], h: true }, checkForUsage)
    })

    it('should print a usage message with lines of 80 chars or less', function (done) {
      argv({ _: [], h: true }, function (txt) {
        var lines = txt.split('\n')
        lines.forEach(function (value) {
          expect(value.length).to.be.below(81)
        })
      })
    })
  })

  describe('version', function () {
    var checkForVersion = function (txt) {
      expect(txt.search(/^\d+\.\d+\.\d+/)).to.equal(0)
    }

    it('should print the version with --version', function (done) {
      argv({ _: [], version: true }, checkForVersion)
    })

    it('should print the version with -v', function (done) {
      argv({ _: [], v: true }, checkForVersion)
    })
  })

  describe('stackwatch', function () {
    var noop = function () {}
    var reset

    beforeEach(function (done) {
      if (reset) {
        reset()
        reset = null
      }
    })

    var checkForError = function (txt) {
      expect(txt).to.equal('Error: data is not valid')
    }

    it('should call check()', function (done) {
      var checkCalled = false

      var stackwatchTestDouble = {
        check: function () {
          checkCalled = true
        }
      }
      expect(checkCalled).to.be.false()
      argv({ _: [] }, noop, stackwatchTestDouble)
      expect(checkCalled).to.be.true()
    })

    it('should print error message if error is received by callback from check()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(new Error('This is a sample error message.'))
        }
      }

      argv(
        { _: [] },
        function (txt) { expect(txt).to.equal('Error: This is a sample error message.') },
        stackwatchTestDouble
      )
    })

    it('should print error message if error is received by callback from start()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'http://example.com/' }] })
        },
        start: function (options, callback) {
          return callback(new Error('This is a sample error message.'))
        },
        stop: clearInterval
      }

      var stdoutTestDouble = function (txt) {
        if (txt !== 'stackwatch is running...') {
          expect(txt).to.equal('Error: This is a sample error message.')
        }
      }

      argv({ _: [] }, stdoutTestDouble, stackwatchTestDouble)
    })

    it('should print error message if error_message included in otherwise invalid data object from check()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { error_message: 'This is another sample error message.' })
        }
      }

      argv(
        { _: [] },
        function (txt) { expect(txt).to.equal('Error: This is another sample error message.') },
        stackwatchTestDouble
      )
    })

    it('should print error message if error_message included in otherwise invalid data object from start()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'http://example.com/' }] })
        },
        start: function (options, callback) {
          return callback(null, { error_message: 'This is yet another sample error message.' })
        },
        stop: clearInterval
      }

      var stdoutTestDouble = function (txt) {
        if (txt !== 'stackwatch is running...') {
          expect(txt).to.equal('Error: This is yet another sample error message.')
        }
      }

      argv({ _: [] }, stdoutTestDouble, stackwatchTestDouble)
    })

    it('should print error message if no data from check()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback()
        }
      }
      argv({ _: [] }, checkForError, stackwatchTestDouble)
    })

    it('should print error message if no data from start()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'http://example.com/' }] })
        },
        start: function (options, callback) {
          return callback()
        },
        stop: clearInterval
      }

      var stdoutTestDouble = function (txt) {
        if (txt !== 'stackwatch is running...') {
          checkForError(txt)
        }
      }

      argv({ _: [] }, stdoutTestDouble, stackwatchTestDouble)
    })

    it('should print error message if empty data object from check()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, {})
        }
      }
      argv({ _: [] }, checkForError, stackwatchTestDouble)
    })

    it('should print error message if empty data object from start()', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'http://example.com/' }] })
        },
        start: function (options, callback) {
          return callback(null, {})
        },
        stop: clearInterval
      }

      var stdoutTestDouble = function (txt) {
        if (txt !== 'stackwatch is running...') {
          checkForError(txt)
        }
      }

      argv({ _: [] }, stdoutTestDouble, stackwatchTestDouble)
    })

    it('should print error message if data.items is empty', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [] })
        }
      }
      argv({ _: [] }, checkForError, stackwatchTestDouble)
    })

    it('should print error message if no creation_date', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ link: 'https://example.com/' }] })
        }
      }
      argv({ _: [] }, checkForError, stackwatchTestDouble)
    })

    it('should print error message if no link', function (done) {
      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403 }] })
        }
      }
      argv({ _: [] }, checkForError, stackwatchTestDouble)
    })

    it('should call opn() if newer creation_date is present', function (done) {
      reset = argv.__set__('opn', function (url) {
        expect(url).to.equal('https://www.example.com/grumbles')
      })

      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'https://www.example.com/fhqwhgads' }] })
        },
        start: function (options, callback) {
          return callback(null, {
            items: [
              { creation_date: 1431712404, link: 'https://www.example.com/grumbles' },
              { creation_date: 1431712403, link: 'https://www.example.com/fhqwhgads' }
            ]
          })
        }
      }
      argv({ _: [] }, noop, stackwatchTestDouble)
    })

    it('should call opn() on newer creation_date even if previous creation_date is no longer present', function (done) {
      reset = argv.__set__('opn', function (url) {
        expect(url).to.equal('https://www.example.com/grumbles')
      })

      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, { items: [{ creation_date: 1431712403, link: 'https://www.example.com/fhqwhgads' }] })
        },
        start: function (options, callback) {
          return callback(null, {
            items: [
              { creation_date: 1431712404, link: 'https://www.example.com/grumbles' }
            ]
          })
        }
      }
      argv({ _: [] }, noop, stackwatchTestDouble)
    })

    it('should not call opn() on older creation_date if previous creation_date is no longer present', function (done) {
      var callCount = 0
      reset = argv.__set__('opn', function () {
        callCount = callCount + 1
      })

      var stackwatchTestDouble = {
        check: function (options, callback) {
          return callback(null, {
            items: [
              { creation_date: 1431712403, link: 'https://www.example.com/fhqwhgads' },
              { creation_date: 1431712402, link: 'https://www.example.com/grumbles' }
            ]
          })
        },
        start: function (options, callback) {
          return callback(null, {
            items: [
              { creation_date: 1431712402, link: 'https://www.example.com/grumbles' }
            ]
          })
        }
      }

      argv({ _: [] }, noop, stackwatchTestDouble)
      expect(callCount).to.equal(0)
    })

    it('should search for tag provided by --tag command line option', function (done) {
      var stackwatchTestDouble = {
        check: function (options) {
          expect(options.tag).to.equal('html5')
        }
      }

      argv({ _: [], tag: 'html5' }, noop, stackwatchTestDouble)
    })

    it('should pass wait option to stackwatch.check()', function (done) {
      var stackwatchTestDouble = {
        check: function (options) {
          expect(options.wait).to.equal('120')
        }
      }

      argv({ _: [], wait: '120' }, noop, stackwatchTestDouble)
    })
  })
})
