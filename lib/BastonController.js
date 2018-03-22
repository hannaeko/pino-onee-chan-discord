'use strict'

const Discord = require('discord.js')

class BastonController {
  get attack () {
    return BastonController.attacks[
      Math.floor(Math.random() * BastonController.attacks.length)]
  }

  get place () {
    return BastonController.places[
      Math.floor(Math.random() * BastonController.places.length)]
  }

  randomTarget (message) {
    let target
    do {
      target = message.channel.members.random()
    } while (target.id == message.member.id)
    return target
  }

  bastonHandler (message) {
    if (message.mentions.everyone) return this.bastonGenerale(message)

    let target = message.mentions.members.random()

    if (target === undefined) {
      target = this.randomTarget(message)
    }

    let targetMention = target.id == message.member.id ? 'himself' : `<@${target.id}>`

    message.channel.send(`<@${message.member.id}> ${this.attack} ${targetMention} in the ${this.place}.`)
  }

  bastonGenerale (message) {
    message.channel.send('BASTON GÉNÉRALE !!')
    for (let i = 0 ; i < 5; i++) {
      let target = message.channel.members.random()
      let theOtherGuy = message.channel.members.random()
      message.channel.send(`<@${theOtherGuy.id}> ${this.attack} <@${target.id}> in the ${this.place}.`)
    }
  }

  castHandler (message) {
    let args = Array.from(arguments)
    let targetId
    let magic

    Discord.MessageMentions.USERS_PATTERN.lastIndex = 0
    if (Discord.MessageMentions.USERS_PATTERN.test(arguments[1])) {
      targetId = args[1]
      magic = args.slice(2).join(' ')
    } else {
      targetId = `<@${this.randomTarget(message).id}>`
      magic = args.slice(1).join(' ')
    }
    console.log(magic)
    console.log(arguments)
    let msg = `<@${message.member.id}> has cast *${magic}* to ${targetId}`
    let p = Math.random()

    if (p <= 0.5) {
      msg += `\nTarget hit in the ${this.place}, well done!`
    } else if (p <= 0.75){
      msg += `\nTarget missed, everybody calm down, <@${message.member.id}> is too bad to aim anyway.`
    } else {
      msg += `\nTarget missed but <@${this.randomTarget(message).id}> was in the neighbourhood and got hit in the ${this.place}.`
    }

    message.channel.send(msg)
  }
}

BastonController.attacks = ['kicks', 'slaps', 'punches', ]
BastonController.places = ['nose', 'balls', 'head', 'eye', 'fat', 'leg']

module.exports = BastonController
