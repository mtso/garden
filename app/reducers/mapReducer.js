// import { point }
import {
  WALK_NORTH,
  WALK_SOUTH,
  WALK_WEST,
  WALK_EAST,
} from '../config/action-type'

const direction = (action) => {
  switch (action.type) {
    case WALK_NORTH:
      return {x: 0, y: -1}
    case WALK_SOUTH:
      return {x: 0, y: +1}
    case WALK_EAST:
      return {x: 1, y: 0}
    case WALK_WEST:
      return {x: -1, y: 0}
    default:
      return {x: 0, y: 0}
  }
}

const mapReducer = (state = {}, action) => {
  switch (action.type) {
    case WALK_NORTH:
    case WALK_SOUTH:
    case WALK_WEST:
    case WALK_EAST:
      let player = state.player || {}
      let pos = player.position || {x: 0, y: 10}
      let delta = direction(action)
      let nextPos = {
        x: pos.x + delta.x,
        y: pos.y + delta.y
      }
      let nextKey = nextPos.x + ':' + nextPos.y
      if (state.map[nextKey] && state.map[nextKey].type === 'FLOOR') {
        return Object.assign({}, state, {
          player: Object.assign({}, player, {
            position: nextPos
          })
        })
      }
    default:
      return state
  }
}

export default mapReducer;
