// var config = require('../config')
const WEAPON_HAND = 'bare hand';

function Player(position, health, attack) {
  this.position = position
  this.health = health
  this.attack = attack
  this.exp = 0
}

module.exports = Player
