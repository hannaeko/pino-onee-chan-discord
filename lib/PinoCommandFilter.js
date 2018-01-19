'use strict'
const config = require('../config')

class PinoCommandFilter {
  constructor (command) {
    this.command = command
  }

  test (message) {
    if (!message.content.length || message.content[0] !== config.prefix)
      return false
    let [command, ...argv] = message.content.slice(1).split(' ').filter(e => e)
    if (command !== this.command)
      return false
    return argv
  }
}

module.exports = PinoCommandFilter;
