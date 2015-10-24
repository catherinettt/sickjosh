'use strict';

var React = require('react');
require('./game.less');
var ws = require('../ws-utils');

class Game extends React.Component {
	constructor(props) {
		super();
    var {query} = props.location;
    this.state = {
      zombie: query && query.zombie
    };

	ws.startReceiver = this.incomingMsg.bind(this);
	}

	incomingMsg() {
		if (message.type === 'start') {
      var user = Parse.User.current();
      if (!user) return;
      var username = user.getUsername();
      if (message.players[username].zombie) {
        this.setState({
          zombie: true
        });
      }
    }
	}
	_renderZombieScreen() {
		return (
			<div className="rc-Game -zombie">
				Zombie
			</div>
		);
	}

	_renderSurvivorScreen() {
		return (
			<div className="rc-Game -survivor">
				Survivor
			</div>
		);
	}

	render() {
		if (this.state.zombie) {
			return this._renderZombieScreen();
		} else {
			return this._renderSurvivorScreen();
		}
	}
}

module.exports = Game;