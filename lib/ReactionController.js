'use strict'
const Discord = require('discord.js')

class ReactionController {
  nepNepHandler (message) {
    let nb = Math.ceil(Math.random() * 2)
    message.channel.send('', new Discord.Attachment(`imgs/nep${nb}.png`))
  }

  deleteHandler (message) {
    let yes = Math.random() > 0.5
    if (yes)
      message.channel.send('', new Discord.Attachment('imgs/error_deleting_file.jpeg'))
  }
}

module.exports = ReactionController
