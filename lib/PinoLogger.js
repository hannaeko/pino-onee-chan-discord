'use strict'

const config = require('../config')

class PinoLogger {
  static init (client, serverId, channelId, enableChannelLog) {
    this.client = client
    this.channel = null
    if (serverId && channelId)
      this.channel = this.client.guilds.get(serverId).channels.get(channelId)
    this.enableChannelLog = this.channel && enableChannelLog
  }

  static log (msg) {
    console.log(msg)
    if (this.enableChannelLog && this.channel) {
      this.channel.send(msg)
    }
  }
}

module.exports = PinoLogger
