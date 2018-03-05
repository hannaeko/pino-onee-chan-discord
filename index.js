const Discord = require('discord.js')
const config = require('./config')

const PinoRouter = require('./lib/PinoRouter')
const PinoCommandFilter = require('./lib/PinoCommandFilter')
const ImagesController = require('./lib/ImagesController')

const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
  client.user.setActivity('Yuri scientific videos, for science.', {type: 'WATCHING'})
})

let router = new PinoRouter(client)
let images = new ImagesController()
router.when(new PinoCommandFilter('ok'), images.okHandler)
router.when(new PinoCommandFilter('flip_table'), images.flipTableHandler)
router.when(new PinoCommandFilter('vivement'), images.vivementHandler)
router.when(new PinoCommandFilter('baka'), images.bakaHandler)

client.login(config.apiToken)
