'use strict';

var React = require('react');

import { Link } from 'react-router';

require('./admin.less')

var ws = require('../ws-utils');
var _ = require('underscore');

var Chat = require('./chat');
var GameStatus = require('./game-status');

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
        <h4>Players ({_.size(this.props.players)})<small className='pull-right'><span className='glyphicon glyphicon-tint'></span>: infected</small> </h4>
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
        objectives: {},
        status: "good"
    }
    ws.adminReceiver = this.incomingMsg.bind(this);
  }

  componentDidMount() {
    var Objective = Parse.Object.extend("Objective");
    var query = new Parse.Query(Objective);
    query.find().then((results) => {
      if (results.length) {
        this.setState({
         objectives: results
        });
      }
    });
  }

  incomingMsg(message) {
    if (message.type === 'status') {
      this.setState({
        registeredPlayers: message.registeredPlayers,
        status: message.status
      });
    } else if (message.type === 'playerUpdate') {
      this.setState({
        registeredPlayers: message.players
      });
    }
  }

  renderObjectives() {
    if (this.state.objectives.length) {
      return this.state.objectives.map((objective) => {
        var activeClass = objective.get('active') ? 'active' : ''
        return (
          <tr className={activeClass} key={objective.id}>
            <td className=''>
              {objective.get('description')}
            </td>
            <td className=''>
              {objective.get('completed') ? 'true' : 'false'}
            </td>
            <td className=''>
              {objective.get('PIN')}
            </td>
            <td className=''>
              <button className='btn btn-sm btn-default' onClick={this.setObjective.bind(this, objective)}><span className='glyphicon glyphicon-flag'></span></button>
            </td>
          </tr>
        )
      })
    }
  }

  setObjective(objective) {
    objective.set('active', true);
    objective.save();

    var data = {
      type: 'setObjective',
      objectiveId: objective.get('objectId'),
    }
    ws.send(JSON.stringify(data));
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
      <div>
        <div className='js-admin container-fluid'>
          <GameStatus gameState={gameStatus}></GameStatus>
          <PlayerList players={players} gameState={gameStatus.status}></PlayerList>
          <hr />
          <div className='-objectives'>
            <h4>Objectives</h4>
            <table className="table">
               <thead>
                <tr>
                  <th>Description</th>
                  <th>Completed</th>
                  <th>PIN</th>
                  <th>Activate</th>
                </tr>
              </thead>
              <tbody>
                {this.renderObjectives()}
              </tbody>
            </table>
          </div>
        </div>
        <Chat {...this.props} zombie={this.state.zombie}/>
      </div>
    );
  }
}

module.exports = Admin;
