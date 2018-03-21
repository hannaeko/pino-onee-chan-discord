'use strict'

class BastonController {
  bastonHandler (message) {
    let target = message.mentions.members.random()

    if (target === undefined) {
      do {
        target = message.channel.members.random()
      } while (target.id == message.member.id)
    }

    let attack = BastonController.attacks[
      Math.floor(Math.random() * BastonController.attacks.length)]
    let place = BastonController.places[
      Math.floor(Math.random() * BastonController.places.length)]
    let targetMention = target.id == message.member.id ? 'himself' : `<@${target.id}>`

    message.channel.send(`<@${message.member.id}> ${attack} ${targetMention} in the ${place}.`)
  }
}

BastonController.attacks = ['kicks', 'slaps', 'punches', ]
BastonController.places = ['nose', 'balls', 'head', 'eye', 'fat', 'leg']

module.exports = BastonController
