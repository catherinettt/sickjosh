'use strict';

var React = require('react');
require('./admin.less')

var ws = require('../ws-utils');

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
        registeredPlayers: {},
        countdown: {}
    }
    ws.adminReceiver = this.incomingMsg.bind(this);
  }

  incomingMsg() {
    if (message.type === 'admin') {
      this.setState({
        registeredPlayers: message.registeredPlayers
      })
    }
  }

  startCountdown() {
    
  }

  render() {
    return (
      <div className='js-admin container-fluid'> 
        <button className='btn btn-lrg' onClick={this.startCountdown.bind(this)}>Start Countdown</button>
        <button className='btn btn-lrg'>Stop Countdown</button>
      </div>
    );
  }
}

module.exports = Admin;