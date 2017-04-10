import statues from '../../assets/statues';
import { place, placeSpawn, placeExit, placeStatue, placeInRooms } from './placer';
import { generateRooms, center } from './room';
import { span, connect } from './hall'
import { randomInt } from './random'

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
  let halls = span(rooms.map(room => center(room))).reduce((acc, edge) => {
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

  let items = []
  for (var i = 0; i < 4; i++) {
    items.push(placeInRooms(rooms))
  }

  fillRooms(grid, rooms)
  fillHalls(grid, halls)
  place(spawn, 'P', grid)
  place(exit, 'E', grid)

  items.forEach(item => {
    place(item, 'H', grid)
  })

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

module.exports = {
  generate,
}
