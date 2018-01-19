'use strict'

class PinoRouter {
  constructor (client) {
    this.client = client
    this.filters = new Map()
    this.client.on('message', this._routeMessage.bind(this))
  }

  _routeMessage (message) {
    if (message.author.id === this.client.user.id)
      return
    for (let [filter, callback] of this.filters.entries()) {
      let arg = filter.test(message)
      if (arg !== false) {
        console.log(`Message filtered by '${filter.constructor.name}', fowarding to controller '${callback.name}'. @${message.author.username}: ${message.content}`)
        callback(message, ...arg)
      }
      console.log(`[Unrouted message] @${message.author.username}: ${message.content}`)
    }
  }

  when (filter, callback) {
    this.filters.set(filter, callback)
  }
}

module.exports = PinoRouter;
