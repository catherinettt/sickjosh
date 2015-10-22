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
        var ready = player.ready ? 'glyphicon glyphicon-ok' : '';
        return (
          <div className='col-xs-6' key={player.playerName}> 
            <span>{player.playerName}</span> <span style={{'color': '#3c763d'}} className={ready}></span>
          </div>
        )
      })
    }
  }
  render() {
    var readyText = this.state.ready ? 'Hold On' : 'Ready Up';
    var welcomeText = this.state.ready ? 'You are ready! Let\'s wait for others.' : 'Go hide and get ready!'; 
    return (
      <div className='sj-lobby container-fluid'> 
        <div className='text-center'>
            <button className='btn btn-lg btn-success' onClick={this.onReady.bind(this)}>{readyText}</button>
        </div>
        <hr />
        <div className="-players">
          <h3>Players <span className='pull-right'>{this.state.readyNumber}/{_.size(this.state.registeredPlayers)}</span></h3>
          <div className='row'>
           {this.renderPlayers()}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Lobby;