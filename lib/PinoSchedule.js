'use strict'

const schedule = require('node-schedule')
const Discord = require('discord.js')
const config = require('../config')

class PinoSchedule {
  constructor () {
    this.initiated = false
  }

  init (client) {
    if (this.initiated !== true) {
      this.initiated = true
      this.client = client
      this.channel = this.client.guilds
        .get(config.scheduler.guild).channels
        .get(config.scheduler.channel)
        schedule.scheduleJob('0 9 * * 1', this.bonneSemaine.bind(this))
    }
  }

  bonneSemaine () {
    this.channel.send('C\'est lundi ! Bonne semaine tout le monde !',
      new Discord.Attachment('imgs/lundi.gif'))
  }
}

module.exports = new PinoSchedule()
