const Discord = require('discord.js')
const config = require('./config')

const PinoRouter = require('./lib/PinoRouter')
const PinoCommandFilter = require('./lib/PinoCommandFilter')
const ImagesController = require('./lib/ImagesController')
const BastonController = require('./lib/BastonController')

const PinoLogger = require('./lib/PinoLogger')

const client = new Discord.Client()

client.on('ready', () => {
  console.log('I am ready!')
  client.user.setActivity('Yuri scientific videos, for science.', {type: 'WATCHING'})
  PinoLogger.init(client, config.logServer, config.logChannel)
})

let router = new PinoRouter(client)
let baston = new BastonController()
let images = new ImagesController()

router.when(new PinoCommandFilter('ok'), images.okHandler)
router.when(new PinoCommandFilter('flip_table'), images.flipTableHandler)
router.when(new PinoCommandFilter('vivement'), images.vivementHandler)
router.when(new PinoCommandFilter('baka'), images.bakaHandler)
router.when(new PinoCommandFilter('police'), images.callingThePoliceHandler)
router.when(new PinoCommandFilter('baston'), baston.bastonHandler.bind(baston))
router.when(new PinoCommandFilter('cast'), baston.castHandler.bind(baston))

client.login(config.apiToken)
