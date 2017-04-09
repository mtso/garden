function generate(size, roomCount) {
  let grid = [];
  for (var r = 0; r < size; r++) {
    let row = []
    for (var c = 0; c < size; c++) {
      row.push('.')
    }
    grid.push(row)
  }
  let rooms = generateRooms(roomCount)
  rooms.forEach((room) => {
    for (var r = room.origin.y; r < room.origin.y + room.size; r++) {
      for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
        grid[r][c] = '█'
      }
    }
  })
  console.log(rooms)
  return grid
}

function generateRooms(count) {
  let rooms = [];
  for (var n = 0; n < count; n++) {
    var room;
    var attempts = 0;
    try {
      do {
        room = randomRoom(3, 10, size)
        attempts++;
        if (attempts > 10) {
          throw 'could not generate a valid room in 10 attempts';
        }
      } while (touches(rooms, room))
      rooms.push(room)
    } catch (err) {
      console.error(err)
    }
  }
  return rooms;
}

function touches(rooms, target) {
  return rooms.some((room) => {
    var isTouching = false;
    var points = [];
    for (var r = target.origin.y; r <= target.origin.y + target.size; r++) {
      for (var c = target.origin.x; c <= target.origin.x + target.size; c++) {
        points.push({x: c, y: r})
      }
    }
    console.log(points)
    return points.some((point) => containsPoint(room, point))
  })
}

// input room { origin: {x, y} size: }
// room contains point if point.x is greater than x, but less than x + size
function containsPoint(room, point) {
  let origin = room.origin
  let xOverlap = point.x >= origin.x && point.x <= origin.x + room.size;
  let yOverlap = point.y >= origin.y && point.y <= origin.y + room.size;
  return xOverlap && yOverlap
}

function randomInt(min, max) {
  if (max) {
    return Math.floor(Math.random() * (max - min)) + min
  } else {
    return Math.floor(Math.random() * min)
  }
}

function randomPoint(size) {
  return {
    x: randomInt(size), // Math.floor(Math.random() * size),
    y: randomInt(size), // Math.floor(Math.random() * size),
  }
}

function randomRoom(min, max, mapSize) {
  let size = randomInt(min, max)
  let origin = randomPoint(mapSize - size)
  return {
    origin: origin,
    size: size
  }
}

module.exports = {
  generate,
}
