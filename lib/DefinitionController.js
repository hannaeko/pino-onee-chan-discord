'use strict'

const req = require('tiny_request')

const Discord = require('discord.js')

class DefinitionController {
  constructor (client) {
    this.client = client
    this.emojiName = {
      'next': '➡',
      'prev': '⬅'
    }
    this.defList = new Map()
  }

  filterEmoji (name, reaction, user) {
    return reaction.emoji.name === name && user.id !== this.client.user.id
  }

  urbanHandler (message) {
    let term = Array.from(arguments).slice(1).join(' ')
    req.get(
      {
        url: 'http://api.urbandictionary.com/v0/define',
        json: true,
        query: {
          term: term
        }
      }, (body, res, err) => {
        if (res.statusCode !== 200 || err)
          return message.channel.send('Something broke...')
        if (body.result_type !== 'exact')
          return message.channel.send(body.result_type) // No result

        message.channel.send(this.urbanMsg(body, 0))
          .then(msg => {
            if (body.list.length == 1)
              return

            this.defList.set(msg.id, 0)

            msg.react(this.emojiName.prev)
            msg.react(this.emojiName.next)

            msg
              .createReactionCollector(this.filterEmoji.bind(this, this.emojiName.next), {time: 600000})
              .on('collect', this.urbanPager.bind(this, 1, body.list.length, msg, body))
            msg
              .createReactionCollector(this.filterEmoji.bind(this, this.emojiName.prev), {time: 600000})
              .on('collect', this.urbanPager.bind(this, -1, 1, msg, body))

          })
      }
    )
  }

  urbanMsg (body, index) {
    let def = body.list[index]
    let finalMessage = `**${def.word}** (${index + 1} / ${body.list.length})\n\n`
    finalMessage += `${def.definition}\n\n`
    finalMessage += `*${def.example}*\n\n`
    finalMessage += `<${def.permalink}>`

    return finalMessage
  }

  /*
   * next : direction = 1 and boundary = body.list.length
   * prev : direction = -1 and boundary = 1
   */
  urbanPager (direction, boundary, msg, body, r) {
    let oldPage = this.defList.get(msg.id)
    let page =  oldPage + direction
    if (page * direction < boundary) {
      msg.edit(this.urbanMsg(body, page))
      this.defList.set(msg.id, page)
    }
    for (let uid of r.users.keys()) {
      if (uid !== this.client.user.id)
        r.remove(uid)
    }
  }
}

module.exports = DefinitionController
