var Code = require('code'); 

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;

var argv = require('../../../lib/cli/argv');

describe('argv', function () {
	describe('help', function () {
		var checkForUsage = function(txt) {
			expect(txt.indexOf('Usage:')).to.equal(0);
		};

		it('should print help message with --help', function (done) {
			argv({_: [], help: true}, checkForUsage);
			done();
		});

		it('should print help message with -h', function (done) {
			argv({_: [], h: true}, checkForUsage);
			done();
		});

		it('should print a usage message with lines of 80 chars or less', function (done) {
			argv({_: [], h: true}, function (txt) {
				var lines = txt.split('\n');
				lines.forEach(function (value) {
					expect(value.length).to.be.below(81);
				});
				done();
			});
		});
	});

	describe('version', function () {
		var checkForVersion = function (txt) {
			expect(txt.search(/^\d+\.\d+\.\d+/)).to.equal(0);
		};

		it('should print the version with --version', function (done) {
			argv({_: [], version: true}, checkForVersion);
			done();
		});

		it('should print the version with -v', function (done) {
			argv({_: [], v: true}, checkForVersion);
			done();
		});
	});
		
	describe('stackwatch', function () {
		var noop = function () {};

		var checkForError = function (txt) {
			expect(txt).to.equal('Error: data is not valid!');
		};

		it('should call check()', function (done) {
			var checkCalled = false;

			var stackwatchTestDouble = {
				check: function () {
					checkCalled = true;
					done();
				}
			};
			expect(checkCalled).to.be.false();
			argv({_: []}, noop, stackwatchTestDouble);
			expect(checkCalled).to.be.true();
		});

		it('should print error message if error is received', function (done) {
			var stackwatchTestDouble = {
				check: function(options, callback) {
					return callback(new Error('This is a sample error message.'));
				}
			};


			argv(
				{_: []}, 
				function (txt) { expect(txt).to.equal('Error: This is a sample error message.'); }, 
				stackwatchTestDouble
			);
			done();
		});

		it('should print error message if no data', function (done) {
			var stackwatchTestDouble = {
				check: function (options, callback) {
					return callback();
				}
			};
			argv({_: []}, checkForError, stackwatchTestDouble);
			done();
		});

		it('should print error message if empty data object', function (done) {
			var stackwatchTestDouble = {
				check: function (options, callback) {
					return callback(null, {});
				}
			};
			argv({_: []}, checkForError, stackwatchTestDouble);
			done();
		});

		it('should print error message if data.items is empty', function (done) {
			var stackwatchTestDouble = {
				check: function (options, callback) {
					return callback(null, {items: []});
				}
			};
			argv({_: []}, checkForError, stackwatchTestDouble);
			done();
		});

		it('should print error message if no question_id', function (done) {
			var stackwatchTestDouble = {
				check: function (options, callback) {
					return callback(null, {items: [{link: 'https://example.com/'}]});
				}
			};
			argv({_: []}, checkForError, stackwatchTestDouble);
			done();
		});

		it('should print error message if no link', function (done) {
			var stackwatchTestDouble = {
				check: function (options, callback) {
					return callback(null, {items: [{question_id: 'fhqwhgads'}]});
				}
			};
			argv({_: []}, checkForError, stackwatchTestDouble);
			done();
		});

		it('should call start() right after check() if wait is 0', function (done) {
			var checkCalled = false;
			var startCalled = false;
			var stackwatchTestDouble = {
				check: function (options, callback) {
					checkCalled = true;
					return callback(null, {items: [{question_id: 'fhqwhgads', link: 'https://www.example.com/'}]});
				},
				start: function() {
					startCalled = true;
				}
			};

			argv({_: [], wait: '0'}, noop, stackwatchTestDouble);
			setTimeout(function () {
				expect(checkCalled).to.be.true();
				expect(startCalled).to.be.true();
				done();
			}, 0);
		});
	});
});
