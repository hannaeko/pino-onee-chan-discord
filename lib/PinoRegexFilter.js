'use strict'

class PinoRegexFilter {
  constructor (regex) {
    this.regex = regex
  }

  test (message) {
    this.regex.lastIndex = 0
    return this.regex.test(message.content)
  }
}

module.exports = PinoRegexFilter
