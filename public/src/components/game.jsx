'use strict';

import {Link} from 'react-router'

var React = require('react');

require('./game.less');

var ws = require('../ws-utils');
var _ = require('underscore');

var Chat = require('./chat');
var Zombie = require('./zombie');
var Pin = require('./pin');

class GameProgress extends React.Component {

  _notifyInfected() {
    ws.playerInfected();
    this._redirect('/zombie');
  }

  _redirect(path) {
    this.props.history.replaceState(null, path);
  }

  render() {

    var zombiePercentage = (this.props.zombieCount / (this.props.survivorCount + this.props.zombieCount)) * 100;
    console.log("Zombie progress: "+ zombiePercentage);

    var objectivePercentage = (this.props.objectivesCompleted / this.props.objectivesTotal.length) * 100;
    console.log("Objective progress: ", objectivePercentage);

    return (
        <div className='-gameProgress'>
          <section className='-players'>
            <div className='-information x-justify'>
              <div className='-zombieCount'>
                <span className='glyphicon glyphicon-tint'></span> {this.props.zombieCount}
              </div>
              <div className="-actions">
                <button type="button" className="btn btn-danger" onClick={this._notifyInfected.bind(this)}>
                  I've been turned!
                </button>
              </div>
              <div className='-survivorCount'>
                <span className='glyphicon glyphicon-user'></span> {this.props.survivorCount}
              </div>
            </div>
            <div className="progress">
              <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" style={{'width': zombiePercentage +'%'}}>
              </div>
            </div>
          </section>
          <section className='-objectives'>
            <div className='-information'>
              {this.props.objectivesCompleted} of {this.props.objectivesTotal.length} objectives completed
            </div>
            <div className="progress x-objectives">
              <div className="progress-bar progress-bar-primary progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{'width': objectivePercentage +'%'}}>
              </div>
              <span className="label label-primary -progress"></span>
            </div>
          </section>
        </div>
    );
  }
}

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
        var current = _.filter(this.state.objectives, function(obj) {
          return obj.get('active');
        });
        if (current.length) {
            return current.map((obj) => {
                var query = {
                    type: 'objective',
                    objectiveId: obj.id,
                    title: 'Objective Code'
                }
                return (
                    <div className="-objectives">
                        <p> {obj.get('description')} </p>
                        <button className='btn btn-default btn-lg' onClick={this._showPin.bind(this, query)}>Enter Code</button>
                    </div>
                )
            })
        }
    }

     _renderSurvivorScreen() {
        return (
            <div className="-survivor container">
                {this._renderCurrentObjective()}
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

        // number of completed objectives
        var progress = _.size(_.filter(this.state.objectives, function(obj) {
          return obj.get('completed');
        }));

        return (
          <div>
            <div className='rc-game'>
                <GameProgress zombieCount={this.state.zombieCount} survivorCount={this.state.survivorCount} objectivesTotal={this.state.objectives} objectivesCompleted={progress} />
                {main}
                {this._renderPinPad()}
            </div>
            <Chat {...this.props} zombie={this.state.zombie}/>
          </div>
        )


    }
}

module.exports = Game;
