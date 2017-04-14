import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Scene from './components/Scene';
import StatusBar from './components/StatusBar'
import { ConnectedGameView } from './components/GameView'
import { ConnectedStatusBar } from './components/StatusBar'

const DOWN = 40
const LEFT = 37
const RIGHT = 39
const UP = 38

import { generate, generateDetailed } from './utils/generate';
import st from './assets/statues';

// let testdata = require('../docs/generation-170411')
// testdata.mobs.forEach(m => {
//   m.isAlive = true
// })
// testdata.player = {
//   position: testdata.spawn
// }
// console.log(testdata)

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
    // this.state = {
    //   // grid: grid,
    //   playerPos: testdata.spawn,
    // }
    this.move = this.move.bind(this)
  }
  move(event) {
    let direction = event.keyCode
    switch (direction) {
      case DOWN:
        this.props.walkSouth()
        break;
      case UP:
        this.props.walkNorth()
        break;
      case RIGHT:
        this.props.walkEast()
        break;
      case LEFT:
        this.props.walkWest()
        break;
      default:
        break;
    }
  }
  render() {
    // <pre>=========================================</pre>
    // <pre>                                         </pre>
    let style = this.props.isBossFloor ? 'boss-floor' : 'floor'
    return (
      <div tabIndex='0' onKeyDown={this.move} style={{textAlign: 'center'}} className={style + ' container'}>
        <div style={{display: 'inline-block', textAlign: 'left'}}>
          <pre>                                           </pre>
          <ConnectedGameView />
          <ConnectedStatusBar />
        </div>
      </div>
    )
  }
}
// <GameView data={testdata} width={41} position={this.props.player.position} />

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import {
  walkNorthAction,
  walkSouthAction,
  walkEastAction,
  walkWestAction,
} from './actions/walk'
import mapReducer from './reducers/map-reducer'

let mapStateToProps = (state) => {
  return {
    isBossFloor: state.isBossFloor,
  }
}

let mapDispatchToProps = (dispatch) => {
  return {
    walkNorth: () => dispatch(walkNorthAction()),
    walkSouth: () => dispatch(walkSouthAction()),
    walkWest: () => dispatch(walkWestAction()),
    walkEast: () => dispatch(walkEastAction()),
  }
}
const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

const store = createStore(mapReducer) //, testdata)
store.dispatch({type: ''})
// console.log(store.getState())

store.subscribe(() => {
  // console.log(store.getState())
})

class AppWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    )
  }
}

ReactDOM.render(<AppWrapper />, document.getElementById('app'));
