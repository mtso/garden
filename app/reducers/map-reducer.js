import {
  WALK,
} from '../config/action-type'

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

const playerReducer = (state = {}, action) => {
  switch (action.type) {
    case WALK:
      return Object.assign({}, state, {
        position: action.nextPosition
      })
    default:
      return state
  }
}

const mapReducer = (state = {}, action) => {
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
        let mobMap = state.mobs.reduce((map, mob) => {
          if (!mob.isAlive) {
            return map
          }
          let key = mob.position.x + ':' + mob.position.y
          map[key] = mob
          return map
        })
        if (mobMap[nextKey]) {
          return Object.assign({}, state, {
            player: playerReducer(player, action)
          })
        }
      }
    // case 'ADVANCE_FLOOR':
    //   return Object.assign({}, state, {
    //     floor: floorReducer(state.floor, action)
    //   })
    default:
      return state
  }
}

export default mapReducer;
