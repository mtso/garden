const EFFORT = 50;
const FIELD_OF_VIEW = 8;

const FLOOR = 'FLOOR'
const WALL = 'WALL'
const POTION = 'POTION'
const WEAPON = 'WEAPON'
const TREASURE = 'TREASURE'
const EXIT = 'EXIT'
const BOSS = 'BOSS'
const PLAYER = 'PLAYER'
const MOB = 'MOB'

let char = {};
char.EXP = '♣'
char.HEALTH = '♥'
char.WEAPON = '♠'
char.ATTACK = '♠'
char.FLOOR = '.'
char.WALL = 'I'
char.PLAYER = '¶'
char.MOB = '#'
char.EXIT = '(♦)'
char.BOSS = '\\&/'
char.POTION = '♥' // temporary while health/attack items not implemented
char.TREASURE = '?'

module.exports = {
  'EFFORT': EFFORT,
  FLOOR,
  WALL,
  POTION,
  WEAPON,
  TREASURE,
  EXIT,
  BOSS,
  PLAYER,
  MOB,
  FIELD_OF_VIEW,
  char,
}
