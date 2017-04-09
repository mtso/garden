// identify main rooms (those above a certain size)
// randomly populate items and objects
import { randomPointInRoom, randomInt } from './random'
import { center, roomInset } from './room'
import { distance } from './math'

function place(point, value, grid) {
  grid[point.y][point.x] = value
}

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

function placeInRooms(rooms) {
  let i = randomInt(rooms.length)
  let bound = roomInset(rooms[i], 1)
  return randomPointInRoom(bound)
}

// Input: string (of ASCII chars)
function placeStatue(statue, mapSize) {
  let len = statue.split('').length
  return {
    x: randomInt(mapSize - len),
    y: randomInt(mapSize - 1),
  }
}

module.exports = {
  place,
  placeSpawn,
  placeExit,
  placeStatue,
  placeInRooms,
}
