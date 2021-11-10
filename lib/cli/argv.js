const open = require('open')

const isDataValid = function (data) {
  return data &&
    data.items instanceof Array &&
    data.items.length &&
    data.items[0].creation_date &&
    data.items[0].link
}

const usageMessage = 'Usage: stackwatch [options]\n' +
  '\n' +
  'Options:\n' +
  '  --tag          Tag to search on [default: node.js]\n' +
  '  --wait         Seconds to wait between checks [default: 60]\n' +
  '  --version, -v  Show version\n' +
  '  --help, -h     Show this message'

module.exports = function (argv, stdout, stackwatch) {
  if (argv.help || argv.h) {
    stdout(usageMessage)
    return
  }

  if (argv.version || argv.v) {
    const version = require('../../package.json').version
    stdout(version)
    return
  }

  const options = {
    wait: argv.wait,
    tag: argv.tag ? argv.tag : 'node.js'
  }

  let lastDate
  let timer
  stackwatch.check(options, function (err, data) {
    if (err) {
      stdout(err.toString())
      return
    }

    if (!isDataValid(data)) {
      const errorMessage = (data && data.error_message) || 'data is not valid'
      stdout('Error: ' + errorMessage)
      return
    }

    lastDate = data.items[0].creation_date

    timer = stackwatch.start(options, function (err, data) {
      if (err) {
        stdout(err.toString())
        stackwatch.stop(timer)
        return
      }

      if (!isDataValid(data)) {
        const errorMessage = (data && data.error_message) || 'data is not valid'
        stdout('Error: ' + errorMessage)
        stackwatch.stop(timer)
        return
      }

      const items = data.items
      let index = 0
      while (items[index] && items[index].creation_date > lastDate) {
        open(items[index].link).then(() => {}, () => {})
        index = index + 1
      }
      lastDate = items[0].creation_date
    })
    stdout('stackwatch is running...')
  })
}
