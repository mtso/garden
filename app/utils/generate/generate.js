import statues from '../../assets/statues';
import { generateRooms, center } from './room';
import { span, connect } from './hall'
import { randomInt, randomPointInRoom } from './random'
import {
  place,
  placeSpawn,
  placeExit,
  placeStatue,
  placeInRooms,
  placeTreasure
} from './placer';
import {
  FLOOR,
  WALL,
  POTION,
  TREASURE,
  WEAPON,
} from '../../config'
import Mob from '../../models/mob'
import Player from '../../models/player'

const NOP = _ => _;
const ASCII = {
  PLAYER: _ => 'P',
  EXIT: _ => 'E',
  ITEM: _ => 'H',
  // WEAPON: _ => 'W', // Same maker as item
  ENEMY: _ => '#',
  TREASURE: _ => 'T',
  SPAWN: _ => 'S', // instead of placing player
}

function generate(size, roomCount, make) {
  make = make || {}
  let keys = Object.keys(ASCII)
  keys.forEach(k => {
    make[k.toLowerCase()] = make[k.toLowerCase()] || ASCII[k]
  })

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
  for (var i = 0; i < Math.floor(size / 7); i++) {
    let r = randomInt(statues.length);
    let s = statues[r]
    st.push({
      string: s,
      origin: placeStatue(s, size)
    })
  }
  let mainRoomSize = 5
  let mainRooms = rooms.filter(room => room.size >= mainRoomSize)
  let treasureCount = Math.floor(size / 15)
  let items = []
  let enemies = [];
  let spawn = placeSpawn(mainRooms)
  let exit = placeExit(mainRooms, spawn)
  let treasure = placeTreasure(rooms, spawn, treasureCount)
  let enemyCount = randomInt(2, Math.floor(size / 7))

  rooms.forEach((r, i) => {
    if (randomInt(3) === 0) {
      items.push(randomPointInRoom(r, i))
    }
  })

  for (var i = 0; i < enemyCount; i++) {
    enemies.push(placeInRooms(mainRooms))
  }

  fillRooms(grid, rooms)
  fillHalls(grid, halls)

  items.forEach(item => {
    place(item, make.item(), grid)
  })
  treasure.forEach(t => {
    place(t, make.treasure(), grid)
  })
  enemies.forEach(e => {
    place(e, make.enemy(), grid)
  })
  place(spawn, make.spawn(), grid)
  place(exit, make.exit(), grid)

  grid.statues = st

  return grid
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
  generateDetailed,
}

function generateDetailed(size, roomCount, make) {
  make = make || {}
  let keys = Object.keys(ASCII)
  keys.forEach(k => {
    make[k.toLowerCase()] = make[k.toLowerCase()] || ASCII[k]
  })

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
  for (var i = 0; i < Math.floor(size / 7); i++) {
    let r = randomInt(statues.length);
    let s = statues[r]
    st.push({
      string: s,
      origin: placeStatue(s, size)
    })
  }
  let mainRoomSize = 5
  let mainRooms = rooms.filter(room => room.size >= mainRoomSize)
  let treasureCount = Math.floor(size / 15)
  let items = []
  let enemies = [];
  let spawn = placeSpawn(mainRooms)
  let exit = placeExit(mainRooms, spawn)
  let treasure = placeTreasure(rooms, spawn, treasureCount)
  let enemyCount = randomInt(2, Math.floor(size / 7))

  rooms.forEach((r, i) => {
    if (randomInt(3) === 0) {
      items.push(randomPointInRoom(r, i))
    }
  })

  for (var i = 0; i < enemyCount; i++) {
    enemies.push(placeInRooms(mainRooms))
  }

  // Make sure tiles overlay properly
  // objects > hallways > rooms
  let roomTiles = tilesForRooms(rooms)
  let hallTiles = halls.map(function(hall) {
    return {
      type: FLOOR,
      position: hall
    }
  })
  let objects = [].concat(treasure).concat(items)
  let objectTiles = objects.map(function(obj) {
    return {
      type: FLOOR,
      position: obj
    }
  })
  let objectMap = mapTiles(objectTiles)
  let floorMap = Object.assign(
    {},
    mapTiles(roomTiles),
    mapTiles(hallTiles),
    mapTiles(objectTiles)
  )
  // objects = objects.map(function(pos) {
  //   return {
  //     type: POTION,
  //     position: pos,
  //     isPickedUp: false,
  //   }
  // })

  treasure = treasure.map(t => {
    return {
      type: TREASURE,
      position: t,
    }
  })

  items = items.map(i => {
    let isHealth = randomInt(2) === 0
    console.log(isHealth)
    return {
      type: isHealth ? POTION : WEAPON,
      position: i,
    }
  })

  let mobs = enemies.map(function(pos) {
    return new Mob(pos, 1, 0)
  })

  // grid.statues = st

  // let allTiles = roomTiles.concat(hallTiles)
  return {
    map: floorMap,
    mobs,
    objects: treasure.concat(items),
    exit,
    spawn,
  }
}

function tilesForRooms(rooms) {
  return rooms.reduce(function(tiles, room) {
    for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
      tiles.push({
        type: WALL,
        position: point(c, room.origin.y)
      })
      tiles.push({
        type: WALL,
        position: point(c, room.origin.y + room.size - 1)
      })
    }
    for (var r = room.origin.y + 1; r < room.origin.y + room.size - 1; r++) {
      for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
        tiles.push({
          type: FLOOR,
          position: point(c, r)
        })
      }
    }
    return tiles
  }, [])
}

function mapTiles(tiles) {
  return tiles.reduce((map, tile) => {
    let k = key(tile.position)
    map[k] = tile
    return map
  }, {})
}

function key(point) {
  return '' + point.x + ':' + point.y;
}

function point(x, y) {
  return {x, y}
}
