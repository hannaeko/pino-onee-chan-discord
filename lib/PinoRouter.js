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
        callback(message, ...arg)
      }
    }
  }

  when (filter, callback) {
    this.filters.set(filter, callback)
  }
}

module.exports = PinoRouter;
