'use strict'

const config = require('../config')

class PinoLogger {
  static init (client, serverId, channelId) {
    this.client = client
    this.channel = this.client.guilds.get(serverId).channels.get(channelId)
  }

  static log (msg) {
    console.log(msg)
    this.channel.send(msg)
  }
}

module.exports = PinoLogger
