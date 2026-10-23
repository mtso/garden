import React, { Component } from 'react'
import { FIELD_OF_VIEW } from '../config'
import { newGameAction } from '../actions/new-game'
import { drawView, pad, formatView, composeLayers } from '../utils/character-layout'

function isEqual(a, b) {
  return a.x === b.x && a.y === b.y
}

// render view with map and position data and size
class GameView extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let pos = this.props.position
    let view = drawView(this.props.data, pos, FIELD_OF_VIEW, this.props.isBossFloor)
    const layout = formatView(view, this.props.width, isEqual(pos, this.props.data.exit))
    let rendered = composeLayers(layout, this.props.data.background, pos, FIELD_OF_VIEW)
      .map((run, index) => (
        <span key={index} style={run.color ? { color: run.color } : undefined}>
          {run.color ? run.text.split('').map((character, characterIndex) => (
            <span key={characterIndex} className='background-character'>{character}</span>
          )) : run.text}
        </span>
      ))

    if (this.props.isGameOver) {
      // console.log(this.props.data.player)
      let isWin = this.props.data.player.health > 0
      let leftPadCount = isWin ? 20 : 16
      let leftPad = pad('', leftPadCount, ' ')
      let vertPad = pad('', 14, '\n')
      let message = isWin ? 'Fin.' : 'Game Over.'
      rendered = <span>{vertPad}{leftPad}<a href='#' onClick={this.props.newGame}>{message}</a>{vertPad}</span>
    }
    return(
      <pre>{rendered}</pre>
    )
  }
}

import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    position: state.player.position,
    data: state,
    width: state.width || 41,
    isBossFloor: state.isBossFloor,
    isGameOver: state.isGameOver,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    newGame: () => dispatch(newGameAction()),
  }
}

export const ConnectedGameView = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GameView)
