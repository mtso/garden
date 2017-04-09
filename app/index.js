window.addEventListener('keydown', (event) => {
  console.log(event.keyCode)
})

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene';

let grid = [
  ['.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', 'S', '.', '.'],
  ['.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.'],
]

class Grid extends Component {
  render() {
    let grid = this.props.grid.map(row => {
      return row.join(' ')
    }).join('\n')
    return (
      <pre>{grid}</pre>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Grid grid={grid} />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
