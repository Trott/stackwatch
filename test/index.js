var Code = require('code'); 

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;
var afterEach = lab.afterEach;

var rewire = require('rewire');
var stackwatch = rewire('../index.js');

var reset;

var noop = function () {};

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
    afterEach(function (done) {
        if (reset) {
            reset();
            reset = null;
        }
        done();
    });

    it('should run a callback', function (done) {
        reset = stackwatch.__set__('context', {
            questions: {
                questions: function (filter, callback) {
                    return process.nextTick(function () {
                        callback(null, {items: [{question_id: 'fhqwhgads', link: 'https://www.example.com/'}]});
                    });
                }
            }
        });

        var verify = function (err, data) {
            expect(err).to.be.null();
            expect(data).to.be.an.object();
            done();
        };
        stackwatch.check({}, verify);
    });

    it('should filter on provided tag in options', function (done) {
        reset = stackwatch.__set__('context', {
            questions: {
                questions: function (filter) {
                    expect(filter.tagged).to.equal('html5');
                    done();
                }
            }
        });

        stackwatch.check({tag: 'html5'}, noop);
    });
});

describe('start()', function () {
    afterEach(function (done) {
        if (reset) {
            reset();
            reset = null;
        }
        done();
    });

    it('should return an object', function (done) {
        reset = stackwatch.__set__('context', {
            questions: {
                questions: noop
            }
        });

        var timer = stackwatch.start({}, function () {});
        expect(timer).to.be.an.object();
        stackwatch.stop(timer);
        done();
    });

    it('should not permit wait to be set under 60', function (done) {
        reset = stackwatch.__set__({
            context: {
                questions: {
                    questions: function (filter, callback) {
                        return process.nextTick(function () {
                            callback(null, {items: [{question_id: 'fhqwhgads', link: 'https://www.example.com/'}]});
                        });
                    }
                }
            },
            setInterval: function (func, delay) {
                expect(delay).to.equal(60000);
                done();
            }
        });

        stackwatch.start({wait: 0}, noop);
    });
});

describe('stop()', function () {
    it('should be an alias for clearInterval', function (done) {
        expect(stackwatch.stop === clearInterval).to.be.true();
        done();
    });
});