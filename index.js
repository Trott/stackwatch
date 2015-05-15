var stackexchange = require('stackexchange');
var context = new stackexchange();

var stackwatch = {};

stackwatch.check = function(options, callback) {  
  var filter = {
    tagged: 'node.js',
    sort: 'creation',
    order: 'desc'
  };

  if (options.tag) {
    filter.tagged = options.tag;
  }

  context.questions.questions(filter, callback);
};

stackwatch.start = function(options, callback) {
  var wait = parseInt(options.wait, 10);
  if (isNaN(wait) || wait < 60) {
  	wait = 60;
  }
  stackwatch.check(options, callback);
  return setInterval(stackwatch.check, 1000 * wait, options, callback);
};

stackwatch.stop = clearInterval;

module.exports = stackwatch;