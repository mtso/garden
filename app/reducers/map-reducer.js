import {
  WALK,
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

const playerReducer = (state = {}, action) => {
  switch (action.type) {
    case WALK:
      return Object.assign({}, state, {
        position: action.next
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
      action.next = nextPos
      if (state.map[nextKey] && state.map[nextKey].type === 'FLOOR') {
        return Object.assign({}, state, {
          player: playerReducer(player, action)
        })
      }
    default:
      return state
  }
}

export default mapReducer;
