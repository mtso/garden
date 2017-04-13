// import { point }
import {
  WALK_NORTH,
  WALK_SOUTH,
  WALK_WEST,
  WALK_EAST,
} from '../config/action-type'

const mapReducer = (state = {}, action) => {
  switch (action.type) {
    case WALK_NORTH:
      let player = state.player || {}
      let pos = player.position || {x: 0, y: 10}
      let key = pos.x + ':' + (pos.y - 1)
      if (state.map[key] && state.map[key].type === 'FLOOR') {
        return Object.assign({}, state, {
          player: Object.assign({}, player, {
            position: {
              x: pos.x,
              y: pos.y - 1
            }
          })
        })
      }
    default:
      return state
  }
}

export default mapReducer;
