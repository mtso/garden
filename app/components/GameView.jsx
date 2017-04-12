import React, { Component } from 'react'
import { char, FIELD_OF_VIEW } from '../config'

function pad(string, count, char) {
  count = count || string.length
  while (string.length < count) {
    string = char + string
  }
  return string
}

function distance(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt(dx*dx + dy*dy)
}

function point(x, y) {
  return {x, y}
}

function place(item, grid) {
  grid[item.position.y][item.position.x] = item.value
}

function tileKey(point) {
  return '' + point.x + ':' + point.y;
}

function charForType(type) {
  return char[type]
}

function isEqual(a, b) {
  return a.x === b.x && a.y === b.y
}

function render(grid, width, isOnExit) {
  let padding = Math.floor( (width - grid.length) / 2 )
  let leftPad = pad('', padding / 2, ' ')
  let vertPad = pad('', padding / 2, '\n')
  return vertPad + grid.map(row => {
    row = row.map(c => c || ' ').join(' ')
    row = leftPad + row
    row = row.replace(' ' + char.EXIT[1] + ' ', char.EXIT)
    row = row.replace(' ' + char.BOSS[1] + ' ', char.BOSS)
    if (isOnExit) {
      row = row.replace(' ' + char.PLAYER + ' ', '(' + char.PLAYER + ')')
    }
    return row
  }).join('\n') + vertPad
}

function drawView(data, position, fov) {
  let size = fov * 2 - 1
  let radius = fov - 1
  let center = point(radius, radius)
  let origin = point(position.x - radius, position.y - radius)
  let grid = [];

  let objectMap = data.objects.reduce((map, obj) => {
    map[tileKey(obj.position)] = obj
    return map
  }, {})
  let mobMap = data.mobs.reduce((map, mob) => {
    mob.type = 'MOB'
    map[tileKey(mob.position)] = mob
    return map
  }, {})

  for (var r = 0; r < size; r++) {
    let row = [];
    for (var c = 0; c < size; c++) {
      let pointInGrid = point(c, r)
      let pointInTiles = point(pointInGrid.x + origin.x, pointInGrid.y + origin.y)
      if (position.x === pointInTiles.x && position.y === pointInTiles.y) {
        row.push(charForType('PLAYER'))
        continue;
      }

      // Determine floor type
      let k = tileKey(pointInTiles)
      let isPoint = distance(position, pointInTiles) < fov && data.map[k]
      let value = isPoint ? charForType(data.map[k].type) : ' '

      // Overlay objects
      if (objectMap[k] && !objectMap[k].isPickedUp) {
        value = charForType(objectMap[k].type)
      } else if (mobMap[k] && mobMap[k].isAlive) {
        value = charForType(mobMap[k].type)
      } else if (k === tileKey(data.exit)) {
        value = charForType('EXIT')[1]
        // or charForType('BOSS')[1]
      }

      row.push(value)
    }
    grid.push(row)
  }
  return grid
}

// render view with map and position data and size
class GameView extends Component {
  render() {
    // let pos = this.props.data.player.position
    // USE PLAYER POSITION INSTEAD
    let pos = this.props.position // || data.spawn
    let view = drawView(this.props.data, pos, FIELD_OF_VIEW)
    let rendered = render(view, this.props.width, isEqual(pos, this.props.data.exit))
    return(
      <pre>{rendered}</pre>
    )
  }
}

export default GameView
