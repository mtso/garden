import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene';

const DOWN = 40
const LEFT = 37
const RIGHT = 39
const UP = 38

import {generate} from './generate';

// let grid = generate(14, 3)
let grid = generate(30, 12)
// let grid = generate(70, 34)
// let grid = generate(200, 64)

class Grid extends Component {
  render() {
    let grid = this.props.grid.map(row => {
      return row.join(' ')
    }).join('\n')
    return (
      <pre style={{fontFamily: '"Monaco", "Consolas", monospace'}}>{grid}</pre>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: grid,
      playerPos: {x: 0, y: 0}
    }
    this.move = this.move.bind(this)
  }
  move(event) {
    let direction = event.keyCode
    switch (direction) {
      case DOWN:
        var nextPos = {
          x: this.state.playerPos.x,
          y: this.state.playerPos.y + 1
        }
        let newGrid = this.state.grid;
        newGrid[nextPos.y][nextPos.x] = 'S'
        this.setState({
          playerPos: nextPos,
          grid: newGrid,
        })
    }
  }
  render() {
    return (
      <div tabIndex='0' onKeyDown={this.move}>
        <Grid grid={this.state.grid} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

// window.addEventListener('keydown', (event) => {
//   console.log(event.keyCode)
//   app.move(event.keyCode)
// })
