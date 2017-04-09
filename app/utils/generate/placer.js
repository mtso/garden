// identify main rooms (those above a certain size)
// randomly populate items and objects
import { randomPointInRoom, randomInt } from './random'
import { center } from './room'
import { distance } from './math'

function placeSpawn(rooms) {
  let i = randomInt(rooms.length)
  return center(rooms[i])
}

function placeExit(rooms, spawn) {
  var dist = 0;
  var furthest = 0;
  console.log(rooms)
  rooms.forEach((room, i) => {
    let d = distance(center(room), spawn)
    console.log(d)
    if (d > dist) {
      // console.log(d)
      furthest = i
      dist = d
    }
  })
  return center(rooms[furthest])
}

module.exports = {
  placeSpawn,
  placeExit,
}
