'use strict'

class PinoRouter {
  constructor (client) {
    this.client = client
    this.filters = new Map()
    this.client.on('message', this._routeMessage.bind(this))
  }

  log (msg) {
    console.log(msg)
    this.client.guilds.get('403202183635402752').channels.get('420247590752223232').send(msg)
  }

  _routeMessage (message) {
    if (message.author.id === this.client.user.id)
      return
    this.log(`New message in channel #${message.channel.name}@${message.guild.name}, @${message.author.username}: ${message.content}`)
    for (let [filter, callback] of this.filters.entries()) {
      let arg = filter.test(message)
      if (arg !== false) {
        this.log(`  Filtered by '${filter.constructor.name}', fowarding to controller '${callback.name}'.`)
        callback(message, ...arg)
      }
    }
  }

  when (filter, callback) {
    this.filters.set(filter, callback)
  }
}

module.exports = PinoRouter;
