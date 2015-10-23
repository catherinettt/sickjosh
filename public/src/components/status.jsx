'use strict';

var React = require('react');
var ws = require('../ws-utils');

import { Router, Route, Link } from 'react-router';

class Status extends React.Component {
  constructor(props) {
    super(props);
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
    setTimeout(() => {
      ws.statusPing();
    }, 500)

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

  logout() {
    var playerName = Parse.User.current().getUsername();
    ws.unregisterPlayer(playerName);
    Parse.User.logOut();
    ws.unregisterPlayer();
    setTimeout(function(){
      if (this.props.history) {
        this.props.history.replaceState(null, '/register')
      }
    }.bind(this), 500);
  }

  render() {

    var statusIcon, statusColor, header, logoutBtn;
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

    header = this.props.location.pathname;

    if (header === '/') {
      header = 'Lobby';
    } else {
      header = header.charAt(1).toUpperCase() + header.substr(2);
    }
    if (Parse.User.current()) {
      logoutBtn = (
        <button type="button" onClick={this.logout.bind(this)} className='btn btn-default navbar-btn pull-right'>Logout</button>
      )
    } 

    return (
      <nav className="navbar navbar-default">
        <div className="container-fluid">
            <a className="navbar-brand">
            <span className='glyphicon glyphicon-globe' style={{'color': statusColor}}></span>
          </a>
          <p className='navbar-text pull-left'>{header}</p>
          {logoutBtn}        
        </div>
      </nav>
    );
  }
}

module.exports = Status;