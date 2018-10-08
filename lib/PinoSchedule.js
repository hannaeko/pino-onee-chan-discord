'use strict'

const schedule = require('node-schedule')
const Discord = require('discord.js')
const config = require('../config')

class PinoSchedule {
  constructor (client) {
    this.client = client
    this.channel = this.client.guilds
      .get(config.scheduler.guild).channels
      .get(config.scheduler.channel)
    schedule.scheduleJob('30 9 * * 1', this.bonneSemaine.bind(this))
  }

  bonneSemaine () {
    this.channel.send('C\'est lundi ! Bonne semaine tout le monde !',
      new Discord.Attachment('imgs/lundi.gif'))
  }
}

module.exports = PinoSchedule
