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
		var startCalled = false;

		it('should start', function (done) {
			var stackwatchTestDouble = {
				start: function () {
					startCalled = true;
					done();
				}
			};
			expect(startCalled).to.be.false();
			argv({_: []}, noop, stackwatchTestDouble);
			expect(startCalled).to.be.true();
		});
	});
});
