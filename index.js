const Discord = require('discord.js')
const config = require('./config')

const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
})


client.on('message', message => {
  console.log(message.author.username, message.content)

  if (message.author.id === client.user.id)
    return

  if (message.content === `${config.prefix}ok`)
    message.channel.send("", new Discord.Attachment('imgs/ok.png'))
  if (message.content === `${config.prefix}flip_table`)
    message.channel.send("", new Discord.Attachment('imgs/flip_table.gif'))
})


client.login(config.apiToken)
