var Code = require('code'); 

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;

var stackwatch = require('../index.js');

describe('exports', function () {
    it('should expose a chck function', function (done) {
        expect(typeof stackwatch.check).to.equal('function');
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