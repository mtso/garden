const EFFORT = 50;

function generate(size, roomCount) {
  let grid = [];
  for (var r = 0; r < size; r++) {
    let row = []
    for (var c = 0; c < size; c++) {
      row.push(' ')
    }
    grid.push(row)
  }
  let rooms = generateRooms(roomCount, size)
  fillRooms(grid, rooms)
  let halls = span(rooms).reduce((acc, edge) => {
    return acc.concat(connect(edge.from, edge.to))
  }, [])
  fillHalls(grid, halls)
  console.log(rooms)
  return grid
}

function fillRooms(map, rooms) {
  rooms.forEach(room => {
    for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
      map[room.origin.y][c] = 'I'
      map[room.origin.y + room.size - 1][c] = 'I'
    }
    for (var r = room.origin.y + 1; r < room.origin.y + room.size - 1; r++) {
      for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
        map[r][c] = '.'
      }
    }
  })
}

function fillHalls(map, halls) {
  halls.forEach(hall => {
    map[hall.y][hall.x] = '.'
  })
}

/*                     *
 *   ROOM GENERATION   *
 *                     */

// Generating based on the given count is done on a
// best effort basis, with the reasoning that if it is
// taking too many tries to generate a valid room,
// the existing rooms already cover enough of the map.
function generateRooms(count, mapSize) {
  let rooms = [];
  let maxSize = Math.floor( (3/70) * mapSize + 6.7 );
  let minSize = Math.floor(maxSize / 2);
  for (var n = 0; n < count; n++) {
    var room;
    var attempts = 0;
    try {
      do {
        room = randomRoom(minSize, maxSize, mapSize)
        attempts++;
        if (attempts > EFFORT) {
          throw `could not generate a valid room in ${EFFORT} attempts`;
        }
      } while (touches(rooms, room))
      rooms.push(room)
    } catch (err) {
      console.error(err)
    }
  }
  return rooms;
}

function randomRoom(min, max, mapSize) {
  let size = randomInt(min, max)
  let origin = randomPoint(mapSize - size)
  return {
    origin: origin,
    size: size
  }
}

// Determines if a target room overlaps or touches
// any room in an existing room collection.
function touches(rooms, target) {
  return rooms.some((room) => {
    var isTouching = false;
    var points = [];
    // Keep a buffer of one on each edge.
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

// function randomNormal() {
//   return (gaussian() + Math.PI) / (Math.PI * 2)
// }
//
// function gaussian() {
//   return Math.sqrt(-2 * Math.log(Math.random())) * Math.cos(2 * Math.PI * Math.random());
// }

function randomPoint(size) {
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

/*                      *
 *  HALLWAY GENERATION  *
 *                      */

function span(rooms) {
  if (rooms.length < 2) {
    return []
  }
  let points = rooms.map(center)
  let tree = [];
  let edges = [];
  // pop point into tree
  // calculate closest nextPoint from any point in tree
  // add nextPoint and the closeset into edges collection
  //   and add nextPoint into tree
  //   and delete nextPoint from points
  tree.push(points.pop())
  while (points.length > 0) {
    var closestEdge = {from: tree[0], to: points[0]};
    var closestDistance = distance(tree[0], points[0]);
    var closestNextIndex = 0;
    points.forEach((point, index) => {
      tree.forEach(node => {
        console.log(node, point)
        if (distance(node, point) < closestDistance) {
          closestEdge = {from: node, to: point}
          closestNextIndex = index;
          closestDistance = distance(node, point)
        }
      })
    })
    edges.push(closestEdge)
    tree.push(points[closestNextIndex])
    console.log(points.length)
    points.splice(closestNextIndex, 1)
  }
  return edges;
}

function center(room) {
  return {
    x: room.origin.x + Math.floor(room.size / 2),
    y: room.origin.y + Math.floor(room.size / 2),
  }
}

function direction(x, y) {
  return Math.floor((y - x) / Math.abs(y - x))
}

// Returns the points that connect a and b orthogonally.
function connect(a, b) {
  var points = [];
  points.push({x: a.x, y: a.y})
  let dx = direction(a.x, b.x)
  let dy = direction(a.y, b.y)
  for (var sx = a.x; sx !== b.x; sx += dx) {
    points.push({x: sx, y: a.y})
  }
  for (var sy = points[points.length - 1].y; sy !== b.y; sy += dy) {
    points.push({x: b.x, y: sy})
  }
  return points
}

module.exports = {
  generate,
}
