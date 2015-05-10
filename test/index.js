var Code = require('code'); 

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;

var rewire = require('rewire');
var stackwatch = rewire('../index.js');
stackwatch.__set__('context', {
    questions: {
        questions: function (filter, callback) {
            return process.nextTick(function () {
                callback(null, {items: [{question_id: 'fhqwhgads', link: 'https://www.example.com/'}]});
            });
        }
    }
});

describe('exports', function () {
    it('should expose check()', function (done) {
        expect(stackwatch.check).to.be.a.function();
        done();
    });

    it('should expose start()', function (done) {
        expect(stackwatch.start).to.be.a.function();
        done();
    });

    it('should expose stop()', function (done) {
        expect(stackwatch.stop).to.be.a.function();
        done();
    });
});

describe('check()', function () {
    it('should run a callback', function (done) {
        var verify = function (err, data) {
            expect(err).to.be.null();
            expect(data).to.be.an.object();
            done();
        };
        stackwatch.check({}, verify);
    });
});

describe('start()', function () {
    it('should return an object', function (done) {
        var timer = stackwatch.start({}, function () {});
        expect(timer).to.be.an.object();
        stackwatch.stop(timer);
        done();
    });

    it('should pass arguments to check()', function (done) {
        stackwatch.start({}, function (err, data) {
            expect(err).to.be.null();
            expect(data).to.be.an.object();
            done();
        });
    });

    it('should run checks in succession if wait is 0', function (done) {
        var checkCount = 0;
        var intervalID = stackwatch.start({wait: 0}, function () {
            checkCount = checkCount + 1;
            if (checkCount === 2) {
                clearInterval(intervalID);
                done();
            }
        });
    });
});

describe('stop()', function () {
    it('should be an alias for clearInterval', function (done) {
        expect(stackwatch.stop === clearInterval).to.be.true();
        done();
    });
});