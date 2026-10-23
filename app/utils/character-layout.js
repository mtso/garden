const { char } = require('../config')

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

function tileKey(point) {
  return '' + point.x + ':' + point.y;
}

function charForType(type) {
  return char[type]
}

function formatView(grid, width, isOnExit) {
  let padding = Math.floor( (width - grid.length) / 2 )
  let leftPad = pad('', padding / 2, ' ')
  let vertPad = pad('', padding / 2, '\n')
  const text = vertPad + grid.map(row => {
    row = row.map(c => c || ' ').join(' ')
    row = leftPad + row
    row = row.replace(' ' + char.EXIT[1] + ' ', char.EXIT)
    row = row.replace(' ' + char.BOSS[1] + ' ', char.BOSS)
    if (isOnExit) {
      row = row.replace(' ' + char.PLAYER + ' ', '(' + char.PLAYER + ')')
    }
    return row
  }).join('\n') + vertPad
  return { text, left: leftPad.length, top: vertPad.length }
}

function drawView(data, position, fov, isBossFloor) {
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
        value = isBossFloor ? charForType('BOSS')[1] : charForType('EXIT')[1]
      }

      row.push(value)
    }
    grid.push(row)
  }
  return grid
}

function composeLayers(layout, background, position, fov) {
  const runs = []
  const radius = fov - 1
  const height = fov * 2 - 1
  const width = height * 2 - 1
  const center = point(radius, radius)
  const camera = { x: 2 * (position.x - radius), y: position.y - radius }
  const lines = layout.text.split('\n')

  function append(text, color) {
    const previous = runs[runs.length - 1]
    if (previous && previous.color === color) previous.text += text
    else runs.push({ text, color })
  }

  lines.forEach((line, y) => {
    line.split('').forEach((character, x) => {
      let color = null
      const inViewport = x >= layout.left && x < layout.left + width &&
        y >= layout.top && y < layout.top + height
      const inFieldOfView = inViewport &&
        distance(point((x - layout.left) / 2, y - layout.top), center) < fov
      if (background && character === ' ' && inFieldOfView) {
        const artX = camera.x + x - layout.left - background.origin.x
        const artY = camera.y + y - layout.top - background.origin.y
        const row = background.rows[artY] || ''
        const behind = row[artX]
        if (behind && behind !== ' ' && behind !== '\u2800') {
          character = behind
          color = background.color
        }
      }
      append(character, color)
    })
    if (y < lines.length - 1) append('\n', null)
  })
  return runs
}

module.exports = { drawView, pad, formatView, composeLayers }
