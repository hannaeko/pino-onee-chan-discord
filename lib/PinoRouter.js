'use strict'

const PinoLogger = require('./PinoLogger')

class PinoRouter {
  constructor (client) {
    this.client = client
    this.filters = new Map()
    this.client.on('message', this._routeMessage.bind(this))
  }

  _routeMessage (message) {
    if (message.author.id === this.client.user.id)
      return
    PinoLogger.log(`New message in channel **#${message.channel.name}@${message.guild.name}**, @${message.author.username}: ${message.content}`)
    for (let [filter, callback] of this.filters.entries()) {
      let arg = filter.test(message)
      if (arg !== false) {
        PinoLogger.log(`➡ Filtered by '${filter.constructor.name}', fowarding to controller '${callback.name}'.`)
        if (arg[Symbol.iterator])
          callback(message, ...arg)
        else
          callback(message, arg)
      }
    }
  }

  when (filter, callback) {
    this.filters.set(filter, callback)
  }
}

module.exports = PinoRouter;
