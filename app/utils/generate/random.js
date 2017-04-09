function randomInt(min, max) {
  if (max) {
    return Math.floor(Math.random() * (max - min)) + min
  } else {
    return Math.floor(Math.random() * min)
  }
}

function randomPoint(size) {
  return {
    x: randomInt(size),
    y: randomInt(size),
  }
}

function randomPointInRoom(room) {
  return {
    x: randomInt(room.origin.x, room.origin.x + room.size),
    y: randomInt(room.origin.y, room.origin.y + room.size),
  }
}

module.exports = {
  randomInt,
  randomPoint,
  randomPointInRoom,
}
