'use strict';

var React = require('react');
var ws = require('../ws-utils');

var _ = require('underscore');

import { Router, Route, Link } from 'react-router';
require('./chat.less');

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
        chatHistory: []
    }
    ws.chatReceiver = this.incomingMsg.bind(this);
  }

  incomingMsg(message) {
    if (message.type === 'chat') {
        if(!this.props.zombie || message.playerName === 'ADMIN') {
          var chatHistory = this.state.chatHistory.concat(message);
          this.setState({
              chatHistory
          });
      }
    }
  }

  onChatSend(e) {
    e.preventDefault();
    var input = React.findDOMNode(this.refs.chatInput);

    if (input.value && Parse.User.current()) {
        ws.sendChat(input.value);
    }
    input.value = '';
  }

  scrollBottomOfChat() {
    var history = React.findDOMNode(this.refs.history);
    history.scrollTop = history.scrollHeight + 100;
  }

  renderChat() {
    if (this.state.chatHistory.length) {
        return this.state.chatHistory.map((chat) => {
            return (
                <div key={_.uniqueId('chat_')}> {chat.playerName}: {chat.text} </div>
            )
        })
    }
  }

  renderInput() {
    if (!this.props.zombie) {
      if (Parse.User.current()) {
        return (
          <form className='-input' onSubmit={this.onChatSend.bind(this)}>
            <div className="input-group">
              <input ref='chatInput' type="text" className="form-control" placeholder="Enter message here" />
              <span className="input-group-btn">
                <button className="btn btn-default" type="button">Send</button>
              </span>
            </div>
          </form>
        )
      }
    }
  }

  render() {
    return (
      <div className='js-chat container-fluid'> 
        <div className='-history' ref="history">
            {this.renderChat()}
        </div>
        {this.renderInput()}
      </div>
    );
  }
}

module.exports = Chat;

module.defaultProps = {
  zombie: false
};