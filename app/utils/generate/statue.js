import {randomInt, randomPoint} from './random'

// Input: string (of ASCII chars)
function randomPlace(statue, mapSize) {
  let len = statue.split('').length
  return {
    x: randomInt(mapSize - len),
    y: randomInt(mapSize - 1),
  }
}

module.exports = randomPlace
