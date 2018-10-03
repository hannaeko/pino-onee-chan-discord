'use strict'

const req = require('tiny_request')
const Discord = require('discord.js')
const figlet = require('figlet');

class CoolTextController {
  darkPseudoHandler (message) {
    let args = Array.from(arguments)
    let changes = {
      'A': '4',
      'E': '3'
    }

    let username
    if (!args) {
      username = message.author
    } else {
      let target = message.mentions.users.first()
      if (target) {
        username = target.username
      } else {
        username = args.slice(1).join(' ')
      }
    }

    let innerText = username
      .replace(/[ae]/gi, m => changes[m.toUpperCase()])
      .replace(/(?:^|\W)\w/g, m => m.toUpperCase())
      .replace(/[^a-zA-Z0-9]/gi, '')

    let text = `xX_D4rk${innerText}_Xx`
    req.post({
      url: 'https://fr.cooltext.com/PostChange',
      form: {
        'BackgroundColor_color': '#FFFFFF',
        'FontSize': '70',
        'Integer12': 'on',
        'Integer13': 'on',
        'Integer9': '0',
        'LogoID': '43',
        'Text': text
      },
      json: true
    }, (body, res, err) => {
      if (err || res.statusCode !== 200)
        return message.channel.send(':"(')
      message.channel.send('', new Discord.Attachment(body.renderLocation))
    })
  }

  figletHandler (message) {
    let msg = message.cleanContent.split(/ +/).slice(1).join(' ')
    let leet = {
      '1': 'i',
      '3': 'e',
      '4': 'a',
      '0': 'o'
    }
    let withoutLeet = msg.replace(new RegExp(`[${Object.keys(leet).join('')}]`, 'i'), m => leet[m])

    let withoutDuplicateMsg = withoutLeet.toLowerCase()
      .split(' ')
      .map(str => str.split('')
        .filter((e, i, self) => self.indexOf(e) == i)
        .join(''))
      .join(' ')

    let badRegex = /(yaoi *(>+|sup([eé]rieur)?( [aà] )?) *yuri)|(yuri *(<+|inf([ée]rieur)?( [àa])?) *yaoi)/i

    if (badRegex.test(withoutDuplicateMsg)) {
      msg = 'yuri > yaoi'
    }
    figlet.text(msg, function (err, data) {
      if (err) {
        message.channel.send('Something went wrong :\'(')
        console.log(err)
        return
      }
      message.channel.send('```\n' + data + '\n```')
    })
  }
}

module.exports = CoolTextController
