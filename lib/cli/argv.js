module.exports = function(argv, stdout, stackwatch) {

  var usageMessage = 'Usage: stackwatch [options]\n' +
    '\n' +
    'Options:\n' +
    '  --version, -v    Show version\n' +
    '  --help, -h       Show this message';

  if (argv.help || argv.h) {
    stdout(usageMessage);
    return;
  }

  if (argv.version || argv.v) {
    var version = require('../../package.json').version;
    stdout(version);
    return;
  }

  stackwatch.start();
  stdout('stackwatch is running...');
};
