const QUALITY = 20;

function generate(size, roomCount) {
  let grid = [];
  for (var r = 0; r < size; r++) {
    let row = []
    for (var c = 0; c < size; c++) {
      row.push('.')
    }
    grid.push(row)
  }
  let rooms = generateRooms(roomCount, size)
  fill(grid, rooms)
  console.log(rooms)
  return grid
}

function fill(map, rooms) {
  rooms.forEach(room => {
    for (var r = room.origin.y; r < room.origin.y + room.size; r++) {
      for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
        map[r][c] = '█'
      }
    }
  })
}

function generateRooms(count, mapSize) {
  let rooms = [];
  let halls = [];
  let maxSize = Math.floor( (3/70) * mapSize + 6.7 );
  let minSize = Math.floor(maxSize / 2);
  rooms.push({
    origin: {
      x: randomInt(minSize) + Math.floor(mapSize / 2 - minSize / 2),
      y: randomInt(minSize) + Math.floor(mapSize / 2 - minSize / 2)
    },
    size: randomInt(minSize, maxSize)
  })
  for (var n = 1; n < count; n++) {
    var room;
    var attempts = 0;
    try {
      do {
        if (rooms.length > 0) {
          room = randomRoom(minSize, maxSize, mapSize) //, rooms[rooms.length - 1], minSize)
          console.log(room)
        } else {
          room = randomRoom(minSize, maxSize, mapSize)
        }
        attempts++;
        if (attempts > QUALITY) {
          throw `could not generate a valid room in ${QUALITY} attempts`;
        }
      } while (touches(rooms, room))
      rooms.push(room)
    } catch (err) {
      console.error(err)
    }
  }
  return rooms;
}

function longestDirection(fromRoom, mapSize) {
  [
    {}
  ]
}

function drawLine(from, direction) {
  return {
    from: from,
    to: {
      x: from.x + direction.x,
      y: from.y + direction.y
    }
  }
}

function touches(rooms, target) {
  return rooms.some((room) => {
    var isTouching = false;
    var points = [];
    for (var r = target.origin.y-1; r <= target.origin.y+target.size; r++) {
      for (var c = target.origin.x-1; c <= target.origin.x+target.size; c++) {
        points.push({x: c, y: r})
      }
    }
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

function randomPoint(size, fromRoom, dist, roomSize) {
  if (fromRoom) {
    return {
      x: randomInt(
        Math.max(fromRoom.origin.x - dist - roomSize, 0),
        Math.min(size, fromRoom.origin.x + fromRoom.size + dist)
      ),
      y: randomInt(
        Math.max(fromRoom.origin.y - dist - roomSize, 0),
        Math.min(size, fromRoom.origin.y + fromRoom.size + dist)
      ),
    }
  }
  return {
    x: randomInt(size),
    y: randomInt(size),
  }
}

function distance(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt(dx*dx + dy*dy)
}

function randomRoom(min, max, mapSize, fromRoom, distance) {
  if (fromRoom) {
    let size = randomInt(min, max)
    let origin = randomPoint(mapSize - size, fromRoom, distance, size)
    return {
      origin: origin,
      size: size
    }
  }
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
