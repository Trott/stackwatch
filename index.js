'use strict'

const Stackexchange = require('stackexchange')
const context = new Stackexchange()

const stackwatch = {}

stackwatch.check = function (options, callback) {
  const filter = {
    tagged: 'node.js',
    sort: 'creation',
    order: 'desc'
  }

  if (options.tag) {
    filter.tagged = options.tag
  }

  context.questions.questions(filter, callback)
}

stackwatch.start = function (options, callback) {
  let wait = parseInt(options.wait, 10)
  if (isNaN(wait) || wait < 60) {
    wait = 60
  }
  return setInterval(stackwatch.check, 1000 * wait, options, callback)
}

stackwatch.stop = clearInterval

module.exports = stackwatch
