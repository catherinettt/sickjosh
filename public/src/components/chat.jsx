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
        var chatHistory = this.state.chatHistory.concat(message);
        this.setState({
            chatHistory
        });
    }
  }

  onChatSend() {
    var input = React.findDOMNode(this.refs.chatInput);

    if (input.value && Parse.User.current()) {
        ws.sendChat(input.value);
    }

    input.value = '';

    this.scrollBottomOfChat();
    
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

  render() {
    return (
      <div className='js-chat container-fluid'> 
        <div className='-history' ref="history">
            {this.renderChat()}
        </div>
        <div className='-input'>
            <div className="">
              <input ref='chatInput' className="form-control" id="exampleInputAmount" placeholder="Enter message here" />
            </div>
            <div className="">
              <button className="btn" onClick={this.onChatSend.bind(this)}> Send </button>
            </div>
        </div>
      </div>
    );
  }
}

module.exports = Chat;