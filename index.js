var stackexchange = require('stackexchange');
var context = new stackexchange();

var stackwatch = {};

stackwatch.check = function(options, callback) {  
  var filter = {
    tagged: 'node.js',
    sort: 'creation',
    order: 'desc'
  };
  context.questions.questions(filter, callback);
};

stackwatch.start = function(options, callback) {
  stackwatch.check(options, callback);
  return setInterval(stackwatch.check, 1000 * 60, options, callback);
};

stackwatch.stop = clearInterval;

module.exports = stackwatch;