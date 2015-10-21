'use strict';

var React = require('react');
var ws = require('../ws-utils');
var _ = require('underscore');

require('./lobby.less');

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      playerName: Parse.User.current().getUsername(), 
      registeredNumber: 0,
      readyNumber: 0, 
      ready: false, 
      registeredPlayers: {}
    }
    ws.readyStateReceiver = this.incomingMsg.bind(this);
  }

  incomingMsg (message) {
    // var message = JSON.parse(e.data);
    if (message.type === 'readyState') {
      this.setState({
        registeredNumber: message.registeredNumber,
        readyNumber: message.readyNumber,
        registeredPlayers: message.registeredPlayers
      });
    }
  }
  onReady () {
    ws.readyPlayer(!this.state.ready);
    this.setState({
      ready: !this.state.ready
    })
  }

  renderPlayers () {
    if (!_.isEmpty(this.state.registeredPlayers)) {
      return _.map(this.state.registeredPlayers, (player) => {
        var ready = player.ready ? '(ready)' : '';
        return (
          <div key={player.playerName}> {player.playerName} {ready} </div>
        )
      })
    }
  }
  render() {
    var readyText = this.state.ready ? 'hold on' : 'ready up';
    var welcomeText = this.state.ready ? 'You are ready! Let\'s wait for others.' : 'Go hide and get ready!'; 
    return (
      <div className='sj-lobby'> 
        <div>Hello {this.state.playerName}! {welcomeText} </div>

        <div className='state'>{this.state.readyNumber} / {this.state.registeredNumber}</div>
        <br />
        <button className='btn btn-lrg' onClick={this.onReady.bind(this)}>{readyText}</button>
        <h3> Players: </h3>
        <div className='-players'> 
          {this.renderPlayers()}
        </div>
      </div>
    );
  }
}

module.exports = Lobby;