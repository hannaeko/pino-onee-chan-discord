'use strict'

const exec = require('child_process').exec
const req = require('tiny_request')
const fs = require('fs')

const Discord = require('discord.js')

class ImagesController {
  okHandler (message) {
    message.channel.send("", new Discord.Attachment('imgs/ok.png'))
  }

  flipTableHandler (message) {
    message.channel.send("", new Discord.Attachment('imgs/flip_table.gif'))
  }

  bakaHandler (message) {
    message.channel.send("", new Discord.Attachment('imgs/baka.png'))
  }

  callingThePoliceHandler (message) {
    message.channel.send("", new Discord.Attachment('imgs/police.png'))
  }

  pramHandler (message) {
    message.channel.send('', new Discord.Attachment('imgs/pram.png'))
  }

  vivementHandler (message, url) {
    let fileName = '/tmp/' + Math.random().toString(36).substring(7)
    let writeStream = fs.createWriteStream(`${fileName}`)
    url = url || 'http://i0.kym-cdn.com/photos/images/original/001/008/747/dbf.gif'
    if (/^<.+>$/.test(url))
      url = url.slice(1).slice(0,-1)
    try {
      req.get({url: url, pipe: writeStream, timeout: 1000})
    } catch (e) {
      console.error(e)
      return
    }
    writeStream.on('close', () => {
      exec(`gm convert -scale 356x244 ${fileName} ${fileName}.png`, (err) => {
        if (err)
          console.error(err)
        else
          exec(`gm composite ${fileName}.png imgs/vivement.png -geometry +33+81 ${fileName}.png`, (err) => {
            if (err)
              console.error(err)
            else
              message.channel.send("", new Discord.Attachment(`${fileName}.png`))
          })
      })
    })
  }

  danbooruHandler (message) {
    let tags = Array.from(arguments).slice(1)

    req.get(
      {
        url: 'https://danbooru.donmai.us/posts/random.json',
        json: true,
        query: {
          tags: tags.join(' ')
        }
      }, (body, res, err) => {
        if (res.statusCode !== 200 || err)
          return message.channel.send(
            'Something went wrong :/\n*(Source : https://fyzgigg.deviantart.com/art/Pino-Wallpaper-137825273)*',
            new Discord.Attachment('https://orig00.deviantart.net/a809/f/2009/264/7/4/pino_wallpaper_by_fyzgigg.jpg'))

        if (!body.file_url)
          return message.channel.send('Try again...')

        message.channel.send(
          `Source : <https://danbooru.donmai.us/posts/${body.id}>`,
          new Discord.Attachment(body.file_url))
      })
  }
}

module.exports = ImagesController
