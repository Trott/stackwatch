var stackexchange = require('stackexchange');
var context = new stackexchange();

var stackwatch = {};

stackwatch.check = function(options, callback) {  
  var filter = {
    tagged: 'node.js',
    sort: 'activity',
    order: 'asc'
  };
  context.questions.questions(filter, callback);
};

stackwatch.start = function(options, callback) {
  stackwatch.check(options, callback);
  return setInterval(stackwatch.check, 1000 * 60 * 5, options, callback);
};

stackwatch.stop = clearInterval;

module.exports = stackwatch;