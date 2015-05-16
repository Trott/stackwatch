var opn = require('opn');

var isDataValid = function (data) {
  return data && 
    data.items instanceof Array && 
    data.items.length && 
    data.items[0].creation_date &&
    data.items[0].link;
};

var usageMessage = 'Usage: stackwatch [options]\n' +
  '\n' +
  'Options:\n' +
  '  --tag          Tag to search on [default: node.js]\n' + 
  '  --wait         Seconds to wait between checks [default: 60]\n' +
  '  --version, -v  Show version\n' +
  '  --help, -h     Show this message';

module.exports = function (argv, stdout, stackwatch) {
  if (argv.help || argv.h) {
    stdout(usageMessage);
    return;
  }

  if (argv.version || argv.v) {
    var version = require('../../package.json').version;
    stdout(version);
    return;
  }

  var options = {};

  options.wait = argv.wait;

  options.tag = argv.tag ? argv.tag : 'node.js';

  var lastDate;
  var timer;
  stackwatch.check(options, function (err, data) {
    if (err) {
      stdout(err.toString());
      return;
    }

    if (! isDataValid(data)) {
      var errorMessage = (data && data.error_message) || 'data is not valid';
      stdout('Error: ' + errorMessage);
      return;
    }

    lastDate = data.items[0].creation_date;

    timer = stackwatch.start(options, function (err, data) {
      if (err) {
        stdout(err.toString());
        stackwatch.stop(timer);
        return;
      }

      if(! isDataValid(data)) {
        var errorMessage = (data && data.error_message) || 'data is not valid';
        stdout('Error: ' + errorMessage);          
        stackwatch.stop(timer);
        return;
      }

      var items = data.items;
      var index = 0;
      while (items[index] && items[index].creation_date > lastDate) {
        opn(items[index].link);
        index = index + 1;
      }
      lastDate = items[0].creation_date;
    });
    stdout('stackwatch is running...');
  });
};
