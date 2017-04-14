import React, { Component } from 'react'
import { char } from '../config'
import { connect } from 'react-redux'

const FIELD_OF_VIEW = 8

function pad(string, count, char) {
  count = count || string.length
  while (string.length < count) {
    string = char + string
  }
  return string
}

class StatusBar extends Component {
  render() {
    let floor = this.props.floor || 1;
    let width = this.props.width || 48; // 41;
    let padding = this.props.padding || 2;
    let player = this.props.player || {}
    let exp = player.exp || 0
    let health = player.health || 0
    let attack = player.attack || 0

    let infoWidth = 0
    let space = pad('', padding, ' ')

    let floorString = '(' + floor + ')'
    let expString = char.EXP + exp
    let healthString = char.HEALTH + health
    let attackString = '' + char.ATTACK + attack
    infoWidth += floorString.length
    infoWidth += expString.length
    infoWidth += healthString.length
    infoWidth += attackString.length
    infoWidth += space.length * 3

    floor = <span className='statusbar statusbar-floor'>{floorString}</span>
    exp = <span className='statusbar statusbar-exp'>{expString}</span>
    health = <span className='statusbar statusbar-health'>{healthString}</span>
    attack = <span className='statusbar statusbar-attack'>{attackString}</span>

    let leftPad = pad('', Math.floor((width - infoWidth) / 2) , ' ')

    // <pre>{leftPad}{floor}{space}{exp}{space}{health}{space}{attack}</pre>
    return(
      <pre>{leftPad}{exp}{space}{health}{space}{attack}</pre>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    player: state.player,
    floor: state.floor,
  }
}

const ConnectedStatusBar = connect(
  mapStateToProps,
  null
)(StatusBar)

export { ConnectedStatusBar }
// export default StatusBar
