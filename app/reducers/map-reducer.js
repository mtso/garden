import {
  WALK,
} from '../config/action-type'
import { generateDetailed } from '../utils/generate'

let initialPlayer = {
  exp: 0,
  health: 10,
  attack: 1,
  position: {x: 0, y: 0}
}

const generateFloor = (floor = 0, player = initialPlayer, isBossFloor = false) => {
  let size = Math.floor(30 * (Math.floor(player.exp / 200) + 1))
  let rooms = Math.floor(size / 2)
  console.log(size, rooms)
  let data = generateDetailed(size, rooms)

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
  console.log(data)
  return Object.assign({}, data, {
    floor: floor + 1,
    player,
  })
}

// const mobReducer = (state = {}, action) => {
//
// }

// const mobsReducer = (state = {}, action) => {
//   let objectMap = state.objects.reduce((map, obj) => {
//     if (pickedUp) {
//       return map
//     }
//     let key = obj.position.x + ':' + obj.position.y
//     map[key] = obj
//     return map
//   })
//   state.mobs.reduce((moved, mob) => {
//     if (!mob.isAlive || mob.isEngaged) {
//       return moved
//     }
//     let tries = 0;
//     while (tries < 4) {
//       tries++;
//       let nextPosition =
//     }
//   })
// }

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
          let isBossFloor = Math.floor(Math.random() * state.player.exp / 100) > 100
          let next = generateFloor(state.floor, state.player, isBossFloor)
          console.log(next)
          return next // generateFloor(state.floor, state.player, isBossFloor)
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
          return Object.assign({}, state, {
            player: playerReducer(player, action)
          })
        } else {
          return state
        }
      }
    default:
      return state
  }
}

export default mapReducer;
