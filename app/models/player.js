// var config = require('../config')
const WEAPON_HAND = 'bare hand';

function Player(position, health) {
  this.position = position
  this.health = health
  this.exp = 0
  this.level = 0
  this.weapon = WEAPON_HAND
}

module.exports = Player
