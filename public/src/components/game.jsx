'use strict';

import {Link} from 'react-router'
var React = require('react');
require('./game.less');
var ws = require('../ws-utils');
var _ = require('underscore');

var Chat = require('./chat');
var Zombie = require('./zombie');
var Pin = require('./pin');

var GameProgress = React.createClass({
  render: function() {
    var percentage = (this.props.zombieCount / (this.props.survivorCount + this.props.zombieCount)) * 100;
    console.log("Zombie progress: "+percentage);
    return (
        <div className='-gameProgress'>
            <div className="progress">
              <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" style={{'width': percentage +'%'}}>
              </div>
            </div>
            <div className='-count'>
                <div className='-survivorCount'>
                    <span className='glyphicon glyphicon-user'></span> {this.props.survivorCount}
                </div>
                <div className='-zombieCount'>
                    <span className='glyphicon glyphicon-tint'></span> {this.props.zombieCount}
                </div>
            </div>
        </div>
    );
  }
});

class Game extends React.Component {
    constructor(props) {
        super(props);
    var {query} = props.location;
    this.state = {
      zombie: query && query.zombie,
      survivorCount: 0,
      zombieCount: 0,
      showPIN: false,
      objectives: {}
    };

    ws.startReceiver = this.incomingMsg.bind(this);
    ws.gameReceiver = this.incomingMsg.bind(this);


      this.redirectZombie();
    }

    componentDidMount() {
        setTimeout(() => {
           if (this.state.survivorCount === 0) {
                ws.statusPing();
            }
        }, 500);

        this.setObjectives();
    }

    setObjectives() {
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
        if (message.type === 'start' || message.type === 'status') {
            var user = Parse.User.current();
            if (!user) return;
            var username = user.getUsername();
            var players = message.players || message.registeredPlayers;
            var survivorCount = _.size(_.filter(players, (player) => {
                return !player.zombie
            }));
            var zombieCount = _.size(players) - survivorCount;
            this.setState({
                zombie: players[username].zombie ? true : false,
                survivorCount,
                zombieCount
            });
        } else if (message.type === 'updateObjective') {
            this.setObjectives();
        }


        this.redirectZombie();
    }

    redirectZombie() {
      if (this.state.zombie) {
          this.props.history.replaceState(null, '/zombie');
          return;
      }
    }

    _renderCurrentObjective () {
        var progress = _.size(_.filter(this.state.objectives, function(obj) {
          return obj.get('completed');
        }));

        var current = _.filter(this.state.objectives, function(obj) {
          return obj.get('active');
        });
        if (current.length) {
            return current.map((obj) => {
                var query = {
                    type: 'objective',
                    objectiveId: obj.id,
                    title: 'Objective PIN'
                }
                return (
                    <div className="-objectives">
                        <span className="label label-primary"> Objective </span>
                        <span className="label label-primary -progress">{progress}/{_.size(this.state.objectives)}</span>
                        <p> {obj.get('description')} </p>
                        <button className='btn btn-default btn-lg' onClick={this._showPin.bind(this, query)}>Enter PIN</button>
                    </div>
                )
            })
        }
    }

    _notifyInfected() {
      ws.playerInfected();
      this._redirect('/zombie');
    }

    _redirect(path) {
      this.props.history.replaceState(null, path);
    }

     _renderSurvivorScreen() {
        return (
            <div className="-survivor container">
                {this._renderCurrentObjective()}
                <div className="-actions">
                    <button type="button" className="btn btn-default btn-lg" onClick={this._notifyInfected.bind(this)}>
                        I am infected...
                    </button>
                </div>
            </div>
        );
    }

    _renderPinPad() {
        if (this.state.showPIN) {
            return (<Pin query={this.state.pinQuery} onClose={this._closePin.bind(this)}/>);
        } else {
            return null;
        }
    }

    _closePin() {
        this.setState({
            showPIN: false
        });
    }

    _showPin(query) {
        this.setState({
            showPIN: true,
            pinQuery: query
        });
    }

    render() {
        var main = this._renderSurvivorScreen();

        return (
          <div>
            <div className='rc-game'>
                <GameProgress zombieCount={this.state.zombieCount} survivorCount={this.state.survivorCount} />
                {main}
                {this._renderPinPad()}
            </div>
            <Chat {...this.props} zombie={this.state.zombie}/>
          </div>
        )


    }
}

module.exports = Game;
