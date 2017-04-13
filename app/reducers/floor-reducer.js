import { generateDetailed } from '../utils/generate'

const mapReducer = (state = {}, action) => {
  if (action.type === 'ADVANCE_FLOOR') {
    let mapData = generateDetailed(30, 15)

    mapData.mobs.map(m => {
      m.isAlive = true
      return m
    })

    let player = Object.assign({}, state.player, {
      position: mapData.spawn
    })

    return {
      ...mapData,
    }
  } else {
    return state
  }
}
const floorReducer = (state = 0, action) => {
  return action.type === 'ADVANCE_FLOOR' ?
    state + 1 : state
}

export floorReducer

// const floorReducer = (state = {}, action) {
//   if (action.type === 'ADVANCE_FLOOR') {
//     let mapData = generateDetailed(30, 15)
//
//     mapData.mobs.map(m => {
//       m.isAlive = true
//       return m
//     })
//
//     return {
//       ...mapData,
//       floor: floor + 1
//     }
//   }
// }
