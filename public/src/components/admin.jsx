'use strict';

var React = require('react');

import { Link } from 'react-router';

require('./admin.less')

var ws = require('../ws-utils');
var _ = require('underscore');

var GameStatus = React.createClass({
  startGame: function() {
    ws.startGame();
  },

  render: function() {
    var statusBar = "";
    if (this.props.gameState.status == "good") {
      statusBar = (
        <div className='-status-lobby'>
          {this.props.gameState.readyPlayers}/{this.props.gameState.totalPlayers} Players Ready
          &nbsp;
          <button className='btn' onClick={this.startGame}>Start Game</button>
        </div>
      )
    } else if (this.props.gameState.status == "active") {
      statusBar = (
        <div className='-status-active'>
          Game Active <button className='btn'>End Game</button>
        </div>
      )
    };
    return(
      <div className='-game-status'>
        <div className='row'>
          <div className='col-xs-4'>
            {statusBar}
          </div>
        </div>
      </div>
    );
  }
});

var PlayerListItem = React.createClass({
  render: function() {
    var icon = '';
    if (this.props.gameState == "good") {
      icon = this.props.player.ready ? 'glyphicon glyphicon-ok' : '';
    } else if (this.props.gameState == "active") {
      icon = this.props.player.zombie ? 'glyphicon glyphicon-tint' : 'glyphicon glyphicon-user';
    }

    return (
      <div className='col-xs-4 -player'>
        <span className={icon}></span> <span>{this.props.player.playerName}</span>
      </div>
    );
  }
});

var PlayerList = React.createClass({
  render: function() {
    var playerListItems = _.map(this.props.players, (player) => {
      return (<PlayerListItem key={player.playerName} player={player} gameState={this.props.gameState}></PlayerListItem>)
    });
    return (
      <div className='-players'>
        <h4>Players <small className='pull-right'><span className='glyphicon glyphicon-tint'></span>: infected</small> </h4>
        <div className='row'>{playerListItems}</div>
      </div>
    );
  }
});

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
        registeredPlayers: {},
        countdown: {},
        safezones: {},
        status: "good"
    }
    ws.adminReceiver = this.incomingMsg.bind(this);
  }

  incomingMsg(message) {
    if (message.type === 'status') {
      this.setState({
        registeredPlayers: message.registeredPlayers,
        status: message.status
      });
    } else if (message.type === 'readyState') {
      this.setState({
        registeredPlayers: message.registeredPlayers
      });
    }
  }

  renderSafezones() {
    if (this.state.safezones.length) {
      return this.state.safezones.map((zone) => {
        return (
          <div className='row' key={zone.id}>
            <div className='col-xs-8'>
              {zone.get('map').get('name')} > {zone.get('name')} (Max: {zone.get('maxAllowance')})
            </div>
            <div className='col-xs-4'>
              <button className='btn btn-xs btn-default pull-right'>Activate</button>
            </div>
          </div>
        )
      })
    }
  }

  render() {
    var players = this.state.registeredPlayers;
    var totalPlayers = _.size(players);
    var readyPlayers = _.size(_.filter(players, function(player) { return player.ready; }));

    var gameStatus = {
      status: this.state.status,
      readyPlayers: readyPlayers,
      totalPlayers: totalPlayers
    }
    return (
      <div className='js-admin container-fluid'>
        <GameStatus gameState={gameStatus}></GameStatus>
        <PlayerList players={players} gameState={gameStatus.status}></PlayerList>
        <hr />
        <div className='-safezones'>
          <h4>Safezones</h4>
          {this.renderSafezones()}
        </div>
      </div>
    );
  }
}

module.exports = Admin;
