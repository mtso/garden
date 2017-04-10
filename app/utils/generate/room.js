import { randomInt, randomPoint } from './random'
import { EFFORT } from '../../config'
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

function center(room) {
  return {
    x: room.origin.x + Math.floor(room.size / 2),
    y: room.origin.y + Math.floor(room.size / 2),
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

function roomInset(room, offset) {
  if (offset > room.size / 2) {
    return {
      origin: center(room),
      size: 1
    }
  } else {
    return {
      origin: {
        x: room.origin.x + offset,
        y: room.origin.y + offset,
      },
      size: room.size - (offset * 2)
    }
  }
}

module.exports = {
  center,
  randomRoom,
  generateRooms,
  touches,
  containsPoint,
  roomInset,
}
