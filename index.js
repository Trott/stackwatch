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

module.exports = stackwatch;