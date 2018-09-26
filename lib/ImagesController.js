'use strict'

const exec = require('child_process').exec
const req = require('tiny_request')
const fs = require('fs')
const util = require('util');
const promiseExec = util.promisify(exec);

const Discord = require('discord.js')

class ImagesController {

  tmpName () {
    return '/tmp/' + Math.random().toString(36).substring(7)
  }

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
    let fileName = this.tmpName()
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
        url: 'https://danbooru.donmai.us/posts.json',
        json: true,
        query: {
          random: true,
          limit: 1,
          tags: tags.join(' ')
        }
      }, (body, res, err) => {
        if (res && res.statusCode === 200) {
          if (body.length && body[0].file_url) {
            message.channel.send(
              `Source : <https://danbooru.donmai.us/posts/${body[0].id}>`,
              new Discord.Attachment(body[0].file_url))
          } else if (body.length) {
            message.channel.send('Try again...')
          } else {
            message.channel.send('404 wsh')
          }
        } else {
          message.channel.send(
            'Something went wrong :/\n*(Source : https://fyzgigg.deviantart.com/art/Pino-Wallpaper-137825273)*',
            new Discord.Attachment('https://orig00.deviantart.net/a809/f/2009/264/7/4/pino_wallpaper_by_fyzgigg.jpg'))
        }
      })
  }

  async saltHandler (message) {
    let username = message.mentions.users.first().username
    let tmpFile = `/tmp/${username}`

    message.channel.send('Creating the salt...')
    await promiseExec(`sed "s/PSEUDO/${username}/" resources/SelJamyPseudo.ass > ${tmpFile}.ass`)
    await promiseExec(`ffmpeg -i resources/SelJamyVierge.mp4 -vf "ass=${tmpFile}.ass" out/${username}.mp4`)
    message.channel.send('Polishing the salt...')

    console.log(`${tmpFile}.mp4`)
    //await message.channel.send(new Discord.Attachment(`${tmpFile}.mp4`))
    console.log(`${tmpFile}.gif envoyé`)
  }
}

module.exports = ImagesController
