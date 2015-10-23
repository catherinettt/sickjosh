'use strict';

var React = require('react');
require('./home.less');
var Chat = require('./chat');
var Status = require('./status');
var ws = require('../ws-utils');


import { Router, Route, Link } from 'react-router';

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      zombie: false
    }

    ws.startReciever = this.incomingMsg.bind(this);
  }

  incomingMsg(message) {
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

  render() {
    return (
      <div className='js-home'> 
        <Status {...this.props} />
        {this.props.children} 
        <Chat {...this.props} zombie={this.state.zombie}/>
      </div>
    );
  }
}

module.exports = Home;