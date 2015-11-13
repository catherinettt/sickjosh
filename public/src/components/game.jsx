'use strict';

import {Link} from 'react-router'

var React = require('react');

require('./game.less');

var ws = require('../ws-utils');
var _ = require('underscore');

var Chat = require('./chat');
var Zombie = require('./zombie');
var Pin = require('./pin');
var GameProgress = require('./game-progress');

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
    componentWillMount () {
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

        // this.redirectZombie();
    }

    redirectZombie() {
      // redirect to zombie screen if user is a zombie
      var Zombie = Parse.Object.extend("Zombie");
      var query = new Parse.Query(Zombie);
      query.equalTo('user', Parse.User.current());
      query.first().then((results) => {
        debugger;
        if (results) {
          this.props.history.replaceState(null, '/zombie');
        }
      });
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
            <div className="-survivor container text-center">
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
                <GameProgress 
                  history={this.props.history} 
                  zombieCount={this.state.zombieCount} 
                  survivorCount={this.state.survivorCount} 
                  objectivesTotal={this.state.objectives} 
                  objectivesCompleted={progress} />
                {main}
                {this._renderPinPad()}
            </div>
            <Chat {...this.props} zombie={this.state.zombie}/>
          </div>
        )


    }
}

module.exports = Game;
