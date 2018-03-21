'use strict'

class BastonController {
  bastonHandler (message) {
    let target = null
    do {
      target = message.channel.members.random()
    } while (target.id != message.member.id)
    let attacks = ['kicks', 'slaps', 'punches', ]
    let places = ['nose', 'balls', 'head', 'eye', 'fat', 'leg']
    let attack = attacks[Math.floor(Math.random() * places.length)]
    let place = places[Math.floor(Math.random() * attacks.length)]

    message.channel.send(`<@${message.member.id}> ${attack} <@${target.id}> in the ${place}.`)
  }
}

module.exports = BastonController
