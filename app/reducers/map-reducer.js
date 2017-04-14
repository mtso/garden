import {
  WALK,
} from '../config/action-type'
import { generateDetailed } from '../utils/generate'
import { TREASURE, POTION, WEAPON, FLOOR } from '../config'
import Mob from '../models/Mob'

let initialPlayer = {
  exp: 0,
  health: 10,
  attack: 1,
  position: {x: 0, y: 0}
}

const tileKey = (point) => point.x + ':' + point.y;

const generateFloor = (floor = 0, player = initialPlayer, isBossFloor = false) => {
  let size = Math.floor(30 * (Math.floor(player.exp / 200) + 1))
  let rooms = Math.floor(size / 2)
  console.log(size, rooms)
  let data = generateDetailed(size, rooms)

  data.mobs = data.mobs.map(function(pos) {
    return new Mob(pos, 10, 1)
  })

  player.position = data.spawn
  data.objectMap = data.objects.reduce((map, obj) => {
    let key = obj.position.x + ':' + obj.position.y
    map[key] = obj
    return map
  }, {})
  data.mobs = data.mobs.map(m => {
    m.isAlive = true
    m.isEngaged = false
    return m
  })
  if (isBossFloor) {
    data.boss = {
      position: data.exit,
      health: player.exp,
      attack: Math.floor(floor + 1 / 20) * Math.floor((player.exp + 1) / 200),
    }
  }
  // console.log(data)
  return Object.assign({}, data, {
    floor: floor + 1,
    player,
    isBossFloor,
  })
}

const playerReducer = (state = initialPlayer, action) => {
  switch (action.type) {
    case WALK:
      return Object.assign({}, state, {
        position: action.nextPosition
      })
    default:
      return state
  }
}

let initialState = generateFloor()

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START':
      return generateFloor()
    case WALK:
      let player = state.player
      let nextPos = {
        x: player.position.x + action.direction.x,
        y: player.position.y + action.direction.y,
      }
      let nextKey = nextPos.x + ':' + nextPos.y
      action.nextPosition = nextPos
      if (state.map[nextKey] && state.map[nextKey].type === 'FLOOR') {
        if (nextPos.x === state.exit.x && nextPos.y === state.exit.y && !state.boss) {
          console.log('REACHED EXIT')
          let isBossFloor = Math.floor(Math.random() * state.player.exp) > 100
          return generateFloor(state.floor, state.player, isBossFloor)
        }

        let item = state.objectMap[nextKey]
        let objectMap = state.objectMap
        let objects = state.objects
        if (item) {
          switch (item.type) {
            case TREASURE:
              player.attack = Math.max(1, player.attack + Math.floor(Math.random() * 12) - 3)
              player.health += Math.floor(Math.random() * 12) - 3
              player.exp += 20 // 15
              break;
            case POTION:
              player.health += Math.floor(Math.random() * 5) - 1
              player.exp += 5
              break;
            case WEAPON:
              player.attack = Math.max(1, player.attack + Math.floor(Math.random() * 5) - 1)
              player.exp += 5
              break;
            default:
              break;
          }
          console.log(Math.floor(Math.random() * 12) - 5)
          console.log(player)
          item.isPickedUp = true
          objectMap = Object.assign(
            {}, state.objectMap, {
              nextKey: item
            }
          )
          objects = objects.map(o => {
            if (nextKey === o.position.x + ':' + o.position.y) {
              console.log(o)
              o.isPickedUp = true
            }
            return o
          })
        }

        let mobMap = state.mobs.reduce((map, mob) => {
          if (!mob.isAlive) {
            return map
          }
          let key = mob.position.x + ':' + mob.position.y
          map[key] = mob
          return map
        }, {})
        console.log(mobMap)
        if (!mobMap[nextKey]) {
          player = playerReducer(player, action)
        } else {
          let mob = mobMap[nextKey]
          mob.health -= player.attack
          mob.isEngaged = true
          if (mob.health <= 0) {
            mob.isAlive = false
          } else {
            player.health -= mob.attack
          }
        }

        if (player.health <= 0) {
          // GAME OVER
          // isGameOver = true
          throw new Error('GAME OVER')
        }

        state.mobs.forEach(m => {
          if (m.isEngaged) {
            return
          }
          let possibleDirections = [
            {x: 0, y: 1},
            {x: 0, y: -1},
            {x: -1, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 0},
          ]
          while (possibleDirections.length > 0) {
            let dir = Math.floor(Math.random() * possibleDirections.length)
            dir = possibleDirections.splice(dir, 1)[0]
            let nextPos = {x: m.position.x + dir.x, y: m.position.y + dir.y}
            let key = nextPos.x + ':' + nextPos.y
            let noMobsInNext = state.mobs.every(mb => {
              if (mb === m) {
                return true
              }
              return !(mb.position.x === nextPos.x && mb.position.y === nextPos.y)
            })
            if (key === player.position.x + ':' + player.position.y) {
              // ATTACK
              player.health -= m.attack
              break;
            }
            if (
              state.map[key] &&
              state.map[key].type === FLOOR &&
              !(objectMap[key] && !objectMap[key].isPickedUp) &&
              key !== player.position.x + ':' + player.position.y &&
              noMobsInNext &&
              key !== state.exit.x + ':' + state.exit.y
            ) {
              m.position = nextPos
              break;
            }
          }
        })

        let newMobs = state.mobs.map(m => {
          m.isEngaged = false
          return m
        })

        return Object.assign({}, state, {
          player,
          objects,
          objectMap,
          mobs: newMobs,
        })
      }
    default:
      return state
  }
}

export default mapReducer;
