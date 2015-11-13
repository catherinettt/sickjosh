'use strict';

var React = require('react');
var ws = require('../ws-utils');
var _ = require('underscore');
var classNames = require('classnames');

var Timer = require('./timer');
var Chat = require('./chat');

require('./lobby.less');

var CountdownTimer = React.createClass({
  render: function() {
    return (
      <h1>Game starting in {this.props.countdownTime}</h1>
    );
  }
});

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      playerName: Parse.User.current().getUsername(),
      registeredNumber: 0,
      readyNumber: 0,
      ready: false,
      players: {},
      registeredPlayers: {},
      timeRemaining: 10000
    };
    ws.readyStateReceiver = this.incomingMsg.bind(this);
    ws.startReceiver = this.startGame.bind(this);
    ws.startCountdownReceiver = this.incomingMsg.bind(this);
    ws.timerReceiver = this.incomingMsg.bind(this);
  }

  componentWillMount() {
    var Game = Parse.Object.extend("Game");
    var query = new Parse.Query(Game);
    query.first().then((game) => {
      if (game) {
        // if in progress go to game
        if (game.get('inProgress')) {
          this.props.history.replaceState(null, '/game');
        }
      }
    });
  }

  incomingMsg (message) {
    // var message = JSON.parse(e.data);
    if (message.type === 'playerUpdate') {
      var readyNumber = _.size(_.filter(message.players, function(player) {
          return player.ready;
        }));
      this.setState({
        registeredNumber: _.size(message.players),
        readyNumber: readyNumber,
        players: message.players
      });
    } else if (message.type === 'timer') {
      if (message.timerName === 'lobbyTimer') {

        if (message.time === 0) {
          this.redirectGame()
        }

        this.setState({
          timeRemaining: "" + message.time
        })
      }
    }
  }

  startGame(message) {
    //var username = user.getUsername();
    //if (message.players[username].zombie) {
    //    this.props.history.replaceState(null, '/game', {zombie: true});
    //} else {
    //  this.props.history.replaceState(null, '/game');
    //}

    this.setState({
      players: message.players
    });
  }

  redirectGame() {
    //var playerName = Parse.User.current().getUsername();
   if (this.state.players[this.state.playerName].zombie) {
          this.props.history.replaceState(null, '/zombie');
      } else {
        this.props.history.replaceState(null, '/game');
      }
  }

  onReady () {
    ws.readyPlayer(!this.state.ready);
    this.setState({
      ready: !this.state.ready
    })
  }

  renderPlayers () {
    if (!_.isEmpty(this.state.players)) {
      return _.map(this.state.players, (player) => {
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
    var readyButtonType = this.state.ready ? 'btn-default' : 'btn-primary';
    var welcomeText = this.state.ready ? 'You are ready! Let\'s wait for others.' : 'Go hide and get ready!';

    var countdownTimer = (this.state.timeRemaining / 1000 !== 10) ? (<Timer timeRemaining={this.state.timeRemaining / 1000} />) : ''

    return (
      <div>
        <div className='sj-lobby container-fluid'>
          <div className='text-center'>
            <h1>
              <button className={classNames('btn btn-lg', readyButtonType)} onClick={this.onReady.bind(this)}>{readyText}</button>
            </h1>
            {countdownTimer}
          </div>
          <hr />
          <div className="-players">
            <h3>Players <span className='pull-right'>{this.state.readyNumber}/{_.size(this.state.players)}</span></h3>
            <div className='row'>
             {this.renderPlayers()}
            </div>
          </div>
        </div>
        <Chat {...this.props} zombie={this.state.zombie}/>
      </div>
    );
  }
}

module.exports = Lobby;
