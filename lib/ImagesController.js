'use strict'

const exec = require('child_process').exec
const req = require('tiny_request')
const fs = require('fs')
const util = require('util')
const cheerio = require('cheerio')
const config = require('../config')

const promiseExec = util.promisify(exec)
const promiseAccess = util.promisify(fs.access)
const promiseGet = function (arg)   {
  return new Promise((resolve, reject) => {
    req.get(arg, (body, response, error) => {
      if (error)
        return reject(error)
      return resolve([body, response])
    })
  })
}

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
    url = url || 'https://i0.kym-cdn.com/photos/images/original/001/008/747/dbf.gif'
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
    let user = message.mentions.users.first()

    if (!user) {
      message.channel.send('No user. No salt.')
      return
    }

    let username = user.username

    try {
      await promiseAccess(`out/${username}.gif`, fs.constants.F_OK)
    } catch (e) {
      let tmpFile = `/tmp/${username}`

      message.channel.send('Creating the salt...')
      await promiseExec(`sed "s/PSEUDO/${username}/" resources/SelJamyPseudo.ass > "${tmpFile}.ass"`)
      await promiseExec(`ffmpeg -i resources/SelJamyVierge.mp4 -vf "ass=${tmpFile}.ass" "out/${username}.gif"`)

      message.channel.send('Polishing the salt...')
    } finally {
      await message.channel.send(encodeURI(`${config.saltBaseUrl}${username}.gif`))
    }
  }

  async zeroChanHandler (message) {
    let query =  Array.from(arguments).slice(1).join(' ')

    let res = await this.zeroChanGetSearch(query)
    if (!res)
      return

    if (res.status === 404) {
      return message.channel.send(`Do you mean ?\n${res.suggestions.join('\n')}`)
    }

    let {href, tags} = await this.zeroChanGetPostUrl(res.location)
    if (href) {
      let {breadcrumbs, imgUrl} = await this.zeroChanGetImg(href)

      return message.channel.send(
        `${breadcrumbs.join(' » ')}\nSource : <https://www.zerochan.net${href}>`,
        new Discord.Attachment(imgUrl))
    }
    message.channel.send(`${tags.length} tags found.\nDo you mean: ${tags.slice(0, 5).join(', ')}...`)
  }

  async zeroChanGetSearch(query) {
    let [body, response] = await promiseGet({
      url: 'https://www.zerochan.net/search',
      query: { q: query }
    })

    if (response.statusCode === 404 || response.statusCode === 200) {
      let $ = cheerio.load(body)

      let suggestions = $('p#suggestions > a').map((i, el) => `- ${$(el).text()}`).get()
      return {
        status: 404,
        suggestions: suggestions
      }
    } else if (response.statusCode === 301) {
      return {
        status: 301,
        location: response.headers.location
      }
    }
  }

  async zeroChanGetPostUrl(topicUrl) {
    let [body, response] = await promiseGet({
      url: `https://www.zerochan.net${topicUrl}`,
      query: { s: 'random' }
    })

    let $ = cheerio.load(body)

    let elem = $('ul#thumbs2 li a').first()
    let href = elem.attr('href')

    let tags = $('ul#children li h3 a').map((i, el) => $(el).text()).get()
    if (!href && !tags.length) {
      return this.zeroChanGetPostUrl(topicUrl)
    }
    console.log(topicUrl, href, tags)
    return {href: href, tags: tags}
  }

  async zeroChanGetImg(postUrl) {
    let [body, response] = await promiseGet({
      url: `https://www.zerochan.net${postUrl}`
    })
    let $ = cheerio.load(body)
    let imgUrl = $('div#large img').attr('src')
    let breadcrumbs = $('p.breadcrumbs a').map((i, el) => $(el).text()).get()
    return {imgUrl: imgUrl, breadcrumbs: breadcrumbs}
  }
}


module.exports = ImagesController
