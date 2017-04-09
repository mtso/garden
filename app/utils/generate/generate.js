import placeStatue from './statue';
import statues from '../../assets/statues';
import { placeSpawn, placeExit } from './placer';

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
  let halls = span(rooms).reduce((acc, edge) => {
    return acc.concat(connect(edge.from, edge.to))
  }, [])
  // generate statues
  let st = [];
  for (var i = 0; i < 3; i++) {
    let r = randomInt(statues.length);
    let s = statues[r]
    st.push({
      string: s,
      origin: placeStatue(s, size)
    })
  }
  let mainRoomSize = 5
  let mainRooms = rooms.filter(room => room.size >= mainRoomSize)
  let spawn = placeSpawn(mainRooms)
  let exit = placeExit(mainRooms, spawn)
  // Place spawn point
  // Place leave point
  // Place items
  // Place weapons

  fillRooms(grid, rooms)
  fillHalls(grid, halls)
  place(spawn, 'P', grid)
  place(exit, 'E', grid)

  grid.statues = st

  return grid
  // return {
  //   rooms: rooms,
  //   halls: halls,
  //   grid: grid,  // temp for now while rooms and halls are still rendered here...
  //   statues: statues
  // }
}

function fillRooms(map, rooms) {
  rooms.forEach(room => {
    for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
      map[room.origin.y][c] = 'I' // 'I' // '皿'
      map[room.origin.y + room.size - 1][c] = 'I' // 'I'
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

function place(point, value, grid) {
  grid[point.y][point.x] = value
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
    // Keep a buffer of 1 on each edge.
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

// Returns a set of minimum-distance edges for connecting into hallways.
// Uses Prim's algorithm to construct a minimum spanning tree
// that connects each room's center point in O(n^2) time.
// https://en.wikipedia.org/wiki/Prim%27s_algorithm
function span(rooms) {
  if (rooms.length < 2) {
    return []
  }
  let points = rooms.map(center)
  let tree = [];
  let edges = [];
  // pop first point into tree
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
        if (distance(node, point) < closestDistance) {
          closestEdge = {from: node, to: point}
          closestNextIndex = index;
          closestDistance = distance(node, point)
        }
      })
    })
    edges.push(closestEdge)
    tree.push(points[closestNextIndex])
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
