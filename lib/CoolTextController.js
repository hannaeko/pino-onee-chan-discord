'use strict'

const req = require('tiny_request')
const Discord = require('discord.js')

class CoolTextController {
  darkPseudoHandler (message) {
    let target = message.mentions.users.first() || message.author
    let text = `xX_d4rk${target.username}_Xx`
    req.post({
      url: 'https://fr.cooltext.com/PostChange',
      form: {
        'BackgroundColor_color': '#FFFFFF',
        'FontSize': '70',
        'Integer12': 'on',
        'Integer13': 'on',
        'Integer9': '0',
        'LogoID': '2870597362',
        'Text': text
      },
      json: true
    }, (body, res, err) => {
      if (res.statusCode !== 200 || err)
        return message.channel.send(':"(')
      message.channel.send('', new Discord.Attachment(body.renderLocation))
    })
  }
}

module.exports = CoolTextController
