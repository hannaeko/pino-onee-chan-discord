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
}

module.exports = ImagesController
