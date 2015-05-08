var Code = require('code'); 

var Lab = require('lab');
var lab = exports.lab = Lab.script();

var expect = Code.expect;
var describe = lab.experiment;
var it = lab.test;

var stackwatch = require('../index.js');

describe('exports', function () {
    it('should expose a start function', function (done) {
        expect(typeof stackwatch.start).to.equal('function');
        done();
    });
});

describe('start()', function () {
});