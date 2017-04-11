import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene';
import StatusBar from './components/StatusBar'
import GameView from './components/GameView'

const DOWN = 40
const LEFT = 37
const RIGHT = 39
const UP = 38

import { generate, generateDetailed } from './utils/generate';
import st from './assets/statues';

// let mapSize = 30
// // let grid = generate(14, 3)
// // let grid = generate(mapSize, 12)
// let grid = generate(30, 20)
// // let grid = generate(120, 54)
// // let grid = generate(200, 64)
// let size = 30
// let demo = generateDetailed(size, 15)
// console.log(JSON.stringify(demo))
// let dg = []
// for (var r = 0; r < size; r++) {
//   let row = []
//   for (var c = 0; c < size; c++) {
//     let tile = demo.map[tileKey(c, r)]
//     if (tile) {
//       row.push(tileForType(tile.type))
//     } else {
//       row.push(' ')
//     }
//   }
//   dg.push(row)
// }
// console.log(dg)


// function tileForType(type) {
//   switch (type) {
//     case 'FLOOR':
//       return '.'
//     case 'WALL':
//       return 'I'
//     default:
//       return 'X'
//   }
// }
//
// let buffer = dg.map(r => {
//   return r.join(' ')
// }).join('\n')
// console.log(">>" + buffer + '<<')
//
// function tileKey(x, y) {
//   return '' + x + ':' + y
// }


let testdata = require('../docs/generation-170411')
testdata.mobs.forEach(m => {
  m.isAlive = true
})
console.log(testdata)

class Grid extends Component {
  render() {
    var i = 0;
    let grid = this.props.grid.map((row) => {
      return row.join(' ')
    }).join('\n')
    grid = grid.split('')

    this.props.grid.statues.forEach(statue => {
      statue.string.split('').forEach((c, i) => {
        let x = statue.origin.x * 2 + i
        let y = statue.origin.y * (mapSize * 2)
        if (grid[y + x] === ' ') {
          grid[y + x] = <span style={{fontFamily: '"Monaco", "Consolas", monospace', color: 'lightGray'}}>{c}</span>
        }
      })
    })
    grid = grid.map(g => {
      return <span style={{fontFamily: '"Monaco", "Consolas", monospace'}}>{g}</span>
    })
    return (
      <pre style={{fontFamily: '"Monaco", "Consolas", monospace'}}>{grid}</pre>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // grid: grid,
      playerPos: testdata.spawn,
    }
    this.move = this.move.bind(this)
  }
  move(event) {
    let direction = event.keyCode
    switch (direction) {
      case DOWN:
        this.setState({ playerPos: {
          x: this.state.playerPos.x,
          y: this.state.playerPos.y + 1
        }})
        break;
      case UP:
        this.setState({ playerPos: {
          x: this.state.playerPos.x,
          y: this.state.playerPos.y - 1
        }})
        break;
      case RIGHT:
        this.setState({ playerPos: {
          x: this.state.playerPos.x + 1,
          y: this.state.playerPos.y
        }})
        break;
      case LEFT:
        this.setState({ playerPos: {
          x: this.state.playerPos.x - 1,
          y: this.state.playerPos.y
        }})
        break;
      default:
        break;
    }
  }
  render() {
    // <pre>=========================================</pre>
    // <pre>                                         </pre>
    return (
      <div tabIndex='0' onKeyDown={this.move} style={{textAlign: 'center'}}>
        <div style={{display: 'inline-block', textAlign: 'left'}}>
          <pre>                                         </pre>
          <GameView data={testdata} width={41} position={this.state.playerPos} />
          <StatusBar />
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
