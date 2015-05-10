var opn = require('opn');

var isDataValid = function (data) {
  return data && 
    data.items instanceof Array && 
    data.items.length && 
    data.items[0].question_id &&
    data.items[0].link;
};

var usageMessage = 'Usage: stackwatch [options]\n' +
  '\n' +
  'Options:\n' +
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

  options.wait = argv.wait ? parseInt(argv.wait, 10) : 60;

  var lastId;
  var timer;
  stackwatch.check({}, function (err, data) {
    if (err) {
      stdout(err.toString());
      return;
    }

    if (! isDataValid(data)) {
      stdout('Error: data is not valid!');
      return;
    }

    lastId = data.items[0].question_id;

    setTimeout(function () {
      timer = stackwatch.start({}, function (err, data) {
        if (err) {
          stdout(err.toString());
          stackwatch.stop(timer);
          return;
        }

        if(! isDataValid(data)) {
          stdout('Error: data is not valid!');
          stackwatch.stop(timer);
          return;
        }

        var items = data.items;
        var index = 0;
        while (items[index] && items[index].question_id !== lastId) {
          opn(items[index].link);
          index = index + 1;
        }
        lastId = items[0].question_id;
      });
    }, 1000 * options.wait);
    stdout('stackwatch is running...');
  });
};
