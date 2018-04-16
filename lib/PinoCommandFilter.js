'use strict'
const Discord = require('discord.js')
const config = require('../config')

class PinoCommandFilter {
  constructor (command, msg = '', args = '') {
    this.command = command
    PinoCommandFilter.help.push({
      command: command,
      msg: msg,
      args: args
    })
    this.msg = msg
    this.args = args
  }

  test (message) {
    if (!message.content.length || message.content.indexOf(config.prefix) !== 0)
      return false
    let [command, ...argv] = message.content.slice(config.prefix.length).split(' ').filter(e => e)
    if (command !== this.command)
      return false
    return argv
  }

  static helpHandler (message) {
    let helpDescr = PinoCommandFilter.help.map(o => `\`${o.command} ${o.args}\`\n${o.msg}`).join('\n\n')
    let helpMsg = new Discord.RichEmbed({
      title: 'Your real Onee-chan.',
      url: 'https://github.com/blacksponge/pino-onee-chan-discord',
      description: `*I\'m a little robot that want to look like a human.*\n\n${helpDescr}`,
      thumbnail: {
        url: 'http://gifgifs.com/animations/anime/ergo-proxy/ergo_proxy_14.gif'
      }
    }).setColor('#a80bc4')
    message.channel.send(helpMsg)
  }
}

PinoCommandFilter.help = []
module.exports = PinoCommandFilter;
