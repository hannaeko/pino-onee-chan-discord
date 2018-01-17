const Discord = require('discord.js')
const config = require('./config')

const client = new Discord.Client()
const token = config.token


client.on('ready', () => {
  console.log('I am ready!')
})


client.on('message', message => {
  console.log(message.author.username, message.content)

  if (message.author.id === client.user.id)
    return

  if (message.content === `${config.prefix}ok`)
    message.channel.send("", new Discord.Attachment('imgs/ok.png'))
})


client.login(token)
