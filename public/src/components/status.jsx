'use strict';

var React = require('react');
var ws = require('../ws-utils');

import { Router, Route, Link } from 'react-router';

class Status extends React.Component {
  constructor() {
    super();
    this.state = {
        statusGood: false,
        isPinging: false,
        lastPing: 0, 
        delay: 0,
        pingInterval: null
    }
    ws.statusReceiver = this.incomingMsg.bind(this);
  }

  componentDidMount() {
    ws.statusPing();
    this.setState({
      isPinging: true
    });

    if (!this.state.pingInterval) {
      setInterval(() => {
        ws.statusPing();
        this.setState({
          isPinging: true
        })
      }, 30000)
    }
  }

  incomingMsg(message) {
    if (message.type === 'status') {
        var newState = {
            statusGood: message.status,
            isPinging: false,
            lastPing: message.time,
            delay: message.delay
        }; 
        if (!message.status && this.state.pingInterval) {
          clearInterval(this.state.pingInterval);
          newState.pingInterval = null;
        }
        this.setState(newState);
    }
  }

  render() {
    var statusIcon, statusColor;
    if (this.state.isPinging) {
      statusIcon = 'glyphicon glyphicon-hourglass';
      statusColor = '#8a6d3b';
    } else if (this.state.statusGood) {
      statusIcon = 'glyphicon glyphicon-thumbs-up';
      statusColor = '#3c763d';
    } else if (!this.state.statusGood) {
      statusIcon = 'glyphicon glyphicon-question-sign';
      statusColor = '#a94442';
    }
    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
            <a className="navbar-brand">
              <span className={statusIcon} style={{'color': statusColor}}></span>
            </a>
            <p className='navbar-text'>Lobby | 0/0 infected </p>
        </div>
      </nav>
    );
  }
}

module.exports = Status;