import {
  WALK_NORTH,
  WALK_SOUTH,
  WALK_WEST,
  WALK_EAST,
} from '../config/action-type'

export const walkNorthAction = () => {
  return {type: WALK_NORTH}
}

export const walkSouthAction = () => {
  return {type: WALK_SOUTH}
}

export const walkWestAction = () => {
  return {type: WALK_WEST}
}

export const walkEastAction = () => {
  return {type: WALK_EAST}
}
