'use strict';

var React = require('react');
require('./game.less');
var ws = require('../ws-utils');
var _ = require('underscore');

class Game extends React.Component {
    constructor(props) {
        super();
    var {query} = props.location;
    this.state = {
      zombie: query && query.zombie,
      survivorCount: 0,
      zombieCount: 0
    };

    ws.startReceiver = this.incomingMsg.bind(this);
    ws.gameStateReceiver = this.incomingMsg.bind(this);

    }

    componentDidMount() {
        setTimeout(() => {
           if (this.state.survivorCount === 0) {
                ws.statusPing();
            } 
        }, 500);
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
        }
    }

    _renderZombieScreen() {
        return (
            <div className="-zombie">
                Zombie
            </div>
        );
    }

    _renderSurvivorScreen() {
        return (
            <div className="-survivor">
                Survivor
            </div>
        );
    }

    _renderGameProgress() {
        var percentage = this.state.zombieCount / this.state.survivorCount;
        return (
            <div className='-gameProgress'>
                <div className="progress">
                  <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{'width': percentage +'%'}}>
                  </div>
                </div>
                <div className='-count'>
                    <div className='-survivorCount'>
                        <span className='glyphicon glyphicon-user'></span> {this.state.survivorCount}
                    </div>
                    <div className='-zombieCount'>
                        <span className='glyphicon glyphicon-tint'></span> {this.state.zombieCount}
                    </div>
                </div>
            </div>
        )
    }

    render() {
        var main;
        if (this.state.zombie) {
            main = this._renderZombieScreen();
        } else {
            main = this._renderSurvivorScreen();
        }

        return (
            <div className='rc-game'>
                {this._renderGameProgress()}
                {main}
            </div>
        )


    }
}

module.exports = Game;