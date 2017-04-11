const data = {"rooms":[{"origin":{"x":7,"y":16},"size":3},{"origin":{"x":23,"y":21},"size":4},{"origin":{"x":0,"y":18},"size":4},{"origin":{"x":9,"y":10},"size":4},{"origin":{"x":6,"y":23},"size":4},{"origin":{"x":7,"y":0},"size":3},{"origin":{"x":12,"y":16},"size":6},{"origin":{"x":2,"y":6},"size":4},{"origin":{"x":22,"y":13},"size":5},{"origin":{"x":15,"y":8},"size":4},{"origin":{"x":23,"y":1},"size":5},{"origin":{"x":15,"y":24},"size":4},{"origin":{"x":0,"y":1},"size":4},{"origin":{"x":12,"y":1},"size":4},{"origin":{"x":23,"y":9},"size":3},{"origin":{"x":0,"y":14},"size":3},{"origin":{"x":1,"y":25},"size":3},{"origin":{"x":18,"y":3},"size":4},{"origin":{"x":8,"y":5},"size":3}],"halls":[{"x":9,"y":6},{"x":9,"y":6},{"x":8,"y":6},{"x":8,"y":5},{"x":8,"y":4},{"x":8,"y":3},{"x":8,"y":2},{"x":9,"y":6},{"x":9,"y":6},{"x":8,"y":6},{"x":7,"y":6},{"x":6,"y":6},{"x":5,"y":6},{"x":4,"y":6},{"x":4,"y":7},{"x":4,"y":8},{"x":4,"y":8},{"x":3,"y":8},{"x":2,"y":8},{"x":2,"y":7},{"x":2,"y":6},{"x":2,"y":5},{"x":2,"y":4},{"x":9,"y":6},{"x":9,"y":6},{"x":10,"y":6},{"x":11,"y":6},{"x":12,"y":6},{"x":13,"y":6},{"x":14,"y":6},{"x":14,"y":5},{"x":14,"y":4},{"x":9,"y":6},{"x":9,"y":6},{"x":10,"y":6},{"x":11,"y":6},{"x":11,"y":7},{"x":11,"y":8},{"x":11,"y":9},{"x":11,"y":10},{"x":11,"y":11},{"x":11,"y":12},{"x":11,"y":12},{"x":10,"y":12},{"x":9,"y":12},{"x":8,"y":12},{"x":8,"y":13},{"x":8,"y":14},{"x":8,"y":15},{"x":8,"y":16},{"x":11,"y":12},{"x":11,"y":12},{"x":12,"y":12},{"x":13,"y":12},{"x":14,"y":12},{"x":15,"y":12},{"x":16,"y":12},{"x":17,"y":12},{"x":17,"y":11},{"x":17,"y":10},{"x":17,"y":10},{"x":18,"y":10},{"x":19,"y":10},{"x":20,"y":10},{"x":20,"y":9},{"x":20,"y":8},{"x":20,"y":7},{"x":20,"y":6},{"x":20,"y":5},{"x":20,"y":5},{"x":21,"y":5},{"x":22,"y":5},{"x":23,"y":5},{"x":24,"y":5},{"x":25,"y":5},{"x":25,"y":4},{"x":20,"y":5},{"x":20,"y":5},{"x":21,"y":5},{"x":22,"y":5},{"x":23,"y":5},{"x":24,"y":5},{"x":24,"y":6},{"x":24,"y":7},{"x":24,"y":8},{"x":24,"y":9},{"x":24,"y":10},{"x":24,"y":10},{"x":24,"y":11},{"x":24,"y":12},{"x":24,"y":13},{"x":24,"y":14},{"x":8,"y":17},{"x":8,"y":17},{"x":7,"y":17},{"x":6,"y":17},{"x":5,"y":17},{"x":4,"y":17},{"x":3,"y":17},{"x":2,"y":17},{"x":2,"y":18},{"x":2,"y":19},{"x":2,"y":20},{"x":2,"y":20},{"x":1,"y":20},{"x":1,"y":19},{"x":1,"y":18},{"x":1,"y":17},{"x":1,"y":16},{"x":2,"y":20},{"x":2,"y":20},{"x":2,"y":21},{"x":2,"y":22},{"x":2,"y":23},{"x":2,"y":24},{"x":2,"y":25},{"x":2,"y":26},{"x":2,"y":26},{"x":3,"y":26},{"x":4,"y":26},{"x":5,"y":26},{"x":6,"y":26},{"x":7,"y":26},{"x":8,"y":26},{"x":8,"y":17},{"x":8,"y":17},{"x":9,"y":17},{"x":10,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":13,"y":17},{"x":14,"y":17},{"x":15,"y":17},{"x":15,"y":18},{"x":15,"y":19},{"x":15,"y":19},{"x":16,"y":19},{"x":17,"y":19},{"x":17,"y":20},{"x":17,"y":21},{"x":17,"y":22},{"x":17,"y":23},{"x":17,"y":24},{"x":17,"y":25},{"x":24,"y":15},{"x":24,"y":15},{"x":25,"y":15},{"x":25,"y":16},{"x":25,"y":17},{"x":25,"y":18},{"x":25,"y":19},{"x":25,"y":20},{"x":25,"y":21},{"x":25,"y":22}]}

let tiles = data.rooms.reduce(function(points, room) {
  // {"origin":{"x":9,"y":10},"size":4}
  // reduces all the rooms into tile points
  // key becomes x:y like 12:3 ?

  for (var r = room.origin.y; r < room.origin.y + room.size; r++) {
    for (var c = room.origin.x; c < room.origin.x + room.size; c++) {
      points.push(point(r, c))
    }
  }
  return points
}, [])

// concat halls into tiles
tiles = tiles.concat(data.halls)

const FIELD_OF_VIEW = 8;

function distance(a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  return Math.sqrt(dx*dx + dy*dy)
}

function point(x, y) {
  return {x, y}
}

console.log(point(1, 3))

// let center = point(0, 0)
let center = point(20, 10)

let size = 30;

// let grid = [];
// for (var r = 0; r < size; r++) {
//   let row = []
//   for (var c = 0; c < size; c++) {
//     row.push(' ')
//   }
//   grid.push(row)
// }

function place(item, grid) {
  grid[item.position.y][item.position.x] = item.value
}

// place({value: '.', position: center}, grid)

function drawView(tiles, position, fov) {
  let mapped = {}
  tiles.forEach(tile => {
    let key = '' + tile.x + ':' + tile.y;
    mapped[key] = '.'
  })
  let size = fov * 2 - 1

  let radius = fov - 1
  let center = point(radius, radius)
  let origin = point(position.x - radius, position.y - radius)
  let originOpp = point(position.x + radius, position.y + radius)
  // console.log(`origin: ${JSON.stringify(origin)}`)
  // console.log(`originOpp: ${JSON.stringify(originOpp)}`)
  // console.log(`center: ${JSON.stringify(center)}`)
  // console.log(`size: ${size}`)

  let grid = [];
  for (r = 0; r < size; r++) {
    let row = [];
    for (c = 0; c < size; c++) {
      let pointInGrid = point(c, r)
      let pointInTiles = point(pointInGrid.x + origin.x, pointInGrid.y + origin.y)

      let key = '' + pointInTiles.x + ':' + pointInTiles.y;
      if (distance(position, pointInTiles) < fov && mapped[key]) {
        row.push('.')
      } else {
        row.push(' ')
      }

    }
    grid.push(row)
  }
  return grid
}

// render(tiles, center, FIELD_OF_VIEW)

// function drawView(center, grid, fov) {
//   // iterate through center.y - fov to center.y + fov
//   //   iterate through center.x - fov to center.x + fov
//   //     if (is valid point and distance is less than fov)
//   //       draw cell
//   let value = '.'
//   for (var r = center.y - fov; r < center.y + fov; r++) {
//     if (!grid[r]) { continue; }
//     for (var c = center.x - fov; c < center.x + fov; c++) {
//       let position = point(c, r)
//       // console.log(grid[r][c])
//       // console.log(distance(position, center))
//       if (grid[r][c] && distance(position, center) < fov) {
//         place({value, position}, grid)
//       }
//     }
//   }
// }

// drawView(center, grid, FIELD_OF_VIEW)
let grid = drawView(tiles, center, FIELD_OF_VIEW)
// console.log(grid)

function render(grid) {
  return grid.map(row => {
    // console.log(row)
    return row.map(c => c || ' ').join(' ')
  }).join('\n')
}

console.log(render(grid))
