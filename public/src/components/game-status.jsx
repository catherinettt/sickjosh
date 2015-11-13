var React = require('react');

var ws = require('../ws-utils');
var chainedFunctions = require('../chained-functions');

class GameStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      inProgress: false
    };

    ws.adminReceiver = chainedFunctions(ws.adminReceiver, this.incomingMsg.bind(this));
    this.startGame = this.startGame.bind(this);
  }

  incomingMsg(message) {
    this.updateProgress();  
  }

  updateProgress() {
    var Game = Parse.Object.extend("Game");
    var query = new Parse.Query(Game);
    query.first().then((game) => {
      if (game) {
        this.setState({
          inProgress: game.get('inProgress')
        });
      }
    });
  }

  componentDidMount() {
    this.updateProgress();
  }

  startGame() {
    var zombieInput = React.findDOMNode(this.refs['zombieCount']);
    var zombieCount = parseInt(zombieInput.value) || 1;
    ws.startGame(zombieCount);
  }

  endGame() {
    ws.endGame();
  }

  render() {
    var statusBar = "";
    if (this.state.inProgress) {
      statusBar = (
        <div className='-status-active'>
          Game Active <button className='btn' onClick={this.endGame}>End Game</button>
        </div>
      )
    } else {
      statusBar = (
        <div className='-status-lobby form-horizontal'>
          <div className='form-group'>
            <label className='col-xs-6'>Initial Number of Zombies</label>
            <div className='col-xs-2'>
              <input className='form-control' type='number' ref='zombieCount' />
            </div>
            <div className='col-xs-4'>
              <button className='btn' onClick={this.startGame}>Start Game</button>
            </div>
          </div>
        </div>
      )
    };
    return(
      <div className='-game-status'>
        <div className='row'>
          <div className='col-xs-12'>
            {statusBar}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = GameStatus;
