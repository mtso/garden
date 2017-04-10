import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene';

const DOWN = 40
const LEFT = 37
const RIGHT = 39
const UP = 38

import {generate} from './utils/generate';
import st from './assets/statues';

let mapSize = 30
// let grid = generate(14, 3)
// let grid = generate(mapSize, 12)
let grid = generate(70, 34)
// let grid = generate(120, 54)
// let grid = generate(200, 64)

class Grid extends Component {
  render() {
    var i = 0;
    let grid = this.props.grid.map((row) => {
      return row.join(' ')
    }).join('\n')
    grid = grid.split('')

    console.log(this.props.grid.statues)
    this.props.grid.statues.forEach(statue => {
      statue.string.split('').forEach((c, i) => {
        let x = statue.origin.x * 2 + i
        let y = statue.origin.y * (mapSize * 2)
        if (grid[y + x] === ' ') {
          grid[y + x] = <span style={{fontFamily: '"Monaco", "Consolas", monospace', color: 'lightGray'}}>{c}</span>
        }
      })
    })

    // let statue = st[1].split('')
    // statue.forEach((char, i) => {
    //   // console.log('text is:', JSON.stringify(grid[i+330]))
    //   if (grid[i+330] === ' ') {
    //     grid[i+330] = <span style={{fontFamily: '"Monaco", "Consolas", monospace', color: 'lightGray'}}>{char}</span>
    //   }
    // })
    grid = grid.map(g => {
      return <span style={{fontFamily: '"Monaco", "Consolas", monospace'}}>{g}</span>
    })
    // let grid = this.props.grid.reduce((g, row, r) => {
    //   return g.concat( row.map((cell, c) => {
    //     // console.log(cell)
    //     return <span key={`${++i}`}></span>
    //   }) )
    //   // return {r}<span>{'\n'}</span>
    //   // return row.join(' ')
    // })//.join(<span>\n</span>)
    // statue.forEach((char, i) => {
    //   // console.log('text is:', JSON.stringify(grid[i+330]))
    //   if (grid[i+330].innerText !== ' ') {
    //     grid[i+330] = <span style={{fontFamily: '"Monaco", "Consolas", monospace'}}>{char}</span>
    //   }
    // })
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
