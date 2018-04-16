'use strict'

const req = require('tiny_request')

const Discord = require('discord.js')

class DefinitionController {
  urbanHandler (message) {
    let term = Array.from(arguments).slice(1)
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
          return message.channel.send(`That was not expected\n\`\`\`json\n${body}\n\`\`\``)

        let def = body.list[0]
        let finalMessage = `**${def.word}**\n\n`
        finalMessage += `${def.definition}\n\n`
        finalMessage += `*${def.example}*\n\n`
        finalMessage += `<${def.permalink}>`

        message.channel.send(finalMessage)
      }
    )
  }
}

module.exports = DefinitionController
