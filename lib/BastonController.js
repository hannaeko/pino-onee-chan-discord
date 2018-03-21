'use strict'

class BastonController {
  get attack () {
    return BastonController.attacks[
      Math.floor(Math.random() * BastonController.attacks.length)]
  }

  get place () {
    return BastonController.places[
      Math.floor(Math.random() * BastonController.places.length)]
  }
  bastonHandler (message) {
    if (message.mentions.everyone) return this.bastonGenerale(message)

    let target = message.mentions.members.random()

    if (target === undefined) {
      do {
        target = message.channel.members.random()
      } while (target.id == message.member.id)
    }

    let targetMention = target.id == message.member.id ? 'himself' : `<@${target.id}>`

    message.channel.send(`<@${message.member.id}> ${this.attack} ${targetMention} in the ${this.place}.`)
  }

  bastonGenerale (message) {
    message.channel.send('BASTON GÉNÉRALE !!')
    for (let i = 0 ; i < 5; i++) {
      let target = message.channel.members.random()
      let theOtherGuy = message.channel.members.random()
      message.channel.send(`<@${target.id}> ${this.attack} <@${theOtherGuy.id}> in the ${this.place}.`)
    }
  }
}

BastonController.attacks = ['kicks', 'slaps', 'punches', ]
BastonController.places = ['nose', 'balls', 'head', 'eye', 'fat', 'leg']

module.exports = BastonController
