'use strict';

var React = require('react');

import { Link } from 'react-router';

require('./admin.less')

var ws = require('../ws-utils');
var _ = require('underscore');

// TODO: Remove hardcoded state and players
var gameState = "active";
var players = [
  {
    playerName: "toby.sullivan",
    zombie: false,
    ready: true
  },
  {
    playerName: "other.guy",
    zombie: false,
    ready: false
  },
  {
    playerName: "zombie.person",
    zombie: true,
    ready: true
  }
];

var GameStatus = React.createClass({
  render: function() {
    var statusBar = "";
    if (this.props.status.state == "lobby") {
      statusBar = (
        <div className='-status-lobby'>
          {this.props.status.readyPlayers}/{this.props.status.totalPlayers} Players Ready
          &nbsp;
          <button className='btn'>Start Game</button>
        </div>
      )
    } else if (this.props.status.state == "active") {
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
    if (this.props.gameState == "lobby") {
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
        safezones: {}
    }
    ws.adminReceiver = this.incomingMsg.bind(this);
  }

  componentDidMount() {
    var SafeZone = Parse.Object.extend("SafeZone");
    var query = new Parse.Query(SafeZone);
    query.include("map");
    query.find().then((results) => {
      if (results.length) {
        this.setState({
         safezones: results
        });
      }
    });
  }

  incomingMsg(message) {
    if (message.type === 'status') {
      this.setState({
        registeredPlayers: message.registeredPlayers
      })
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
    var totalPlayers = _.size(players);
    var readyPlayers = _.size(_.filter(players, function(player) { return player.ready; }));

    var gameStatus = {
      state: gameState,
      readyPlayers: readyPlayers,
      totalPlayers: totalPlayers
    }
    return (
      <div className='js-admin container-fluid'>
        <GameStatus status={gameStatus}></GameStatus>
        <PlayerList players={players} gameState={gameStatus.state}></PlayerList>
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
