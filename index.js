const Discord = require('discord.js')
const config = require('./config')

const PinoRouter = require('./lib/PinoRouter')
const PinoCommandFilter = require('./lib/PinoCommandFilter')
const ImagesController = require('./lib/ImagesController')
const BastonController = require('./lib/BastonController')
const DefinitionController = require('./lib/DefinitionController')

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
let define = new DefinitionController()

router.when(new PinoCommandFilter('ok', 'cordialement, okay'), images.okHandler)
router.when(new PinoCommandFilter('flip_table', 'FUCK THAT SHIT'), images.flipTableHandler)
router.when(new PinoCommandFilter('vivement', 'hu hu hu, I really hope that tomorrow will come quickly.', '[url]'), images.vivementHandler)
router.when(new PinoCommandFilter('baka', 'It\'s not that I like you or anything, b-b-baka!'), images.bakaHandler)
router.when(new PinoCommandFilter('police', 'That. Is. Not. Legal.'), images.callingThePoliceHandler)
router.when(new PinoCommandFilter('pic', 'Random pic from danbooru.', '[...tags]'), images.danbooruHandler)
router.when(new PinoCommandFilter('baston', 'FAITO~~', '[target]'), baston.bastonHandler.bind(baston))
router.when(new PinoCommandFilter('cast', 'Aren\'t you a wizzard my friend?', '[target] spell'), baston.castHandler.bind(baston))
router.when(new PinoCommandFilter('pram', 'PRAM'), images.pramHandler)
router.when(new PinoCommandFilter('define', 'Define some word', 'word'), define.urbanHandler)
router.when(new PinoCommandFilter('?', 'Display help.'), PinoCommandFilter.helpHandler)

client.login(config.apiToken)
