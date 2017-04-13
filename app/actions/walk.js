import {
  WALK,
  WALK_NORTH,
  WALK_SOUTH,
  WALK_WEST,
  WALK_EAST,
} from '../config/action-type'

export const walkNorthAction = () => {
  return {
    type: WALK,
    direction: {x: 0, y: -1}
  }
}

export const walkSouthAction = () => {
  return {
    type: WALK,
    direction: {x: 0, y: 1}
  }
}

export const walkWestAction = () => {
  return {
    type: WALK,
    direction: {x: -1, y: 0}
  }
}

export const walkEastAction = () => {
  return {
    type: WALK,
    direction: {x: 1, y: 0}
  }
}
