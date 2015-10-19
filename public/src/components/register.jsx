'use strict';

var React = require('react');
var host = window.document.location.host.replace(/:.*/, '');
var ws = require('../ws-utils');

require('./register.less');

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null
    }
  }

  registerPlayer () {
    var playerName =  React.findDOMNode(this.refs.playerName).value;

    if (!playerName) {
      this.setState({
        error: "Please enter your Hootsuite id"
      });
      return;
    } else {
      this.setState({
        error: null
      })
    }

    Parse.User.logIn(playerName, playerName).then(() => {
      ws.registerPlayer();
      if (this.props.location.state && this.props.location.state.nextPathname) {
        this.props.history.replaceState(null, this.props.location.state.nextPathname)
      } else {
        this.props.history.replaceState(null, '/lobby')
      }
    }, (e) => {
      this.createParseUser(playerName);
    })
  }

  createParseUser (playerName) {
    var user = new Parse.User();
    user.set("username", playerName);
    user.set("password", playerName);
    user.set("email", playerName + '@hootsuite.com');

    user.signUp().then(() => {
      ws.registerPlayer();
      if (this.props.location.state && this.props.location.state.nextPathname) {
        this.props.history.replaceState(null, this.props.location.state.nextPathname)
      } else {
        this.props.history.replaceState(null, '/about')
      }
    });
  }

  renderError () {
    if (this.state.error) {
      return (
        <div className="alert alert-warning" role="alert">{this.state.error}</div>
      )
    }
  }

  render() {
    return (
      <div className='js-register'> 
        <h2>Player Register</h2>
        <form className='form-inline'>
          <div className="form-group">
            <div className="input-group">
              <input ref="playerName" type="text" className="form-control" id="exampleInputAmount" placeholder="josh.gildart" />
              <div className="input-group-addon">@hootsuite.com</div>
            </div>
            </div>
            <button onClick={this.registerPlayer.bind(this)} className="btn btn-default">Enter</button>
        </form>
        {this.renderError()}
      </div>
    );
  }
}

module.exports = Register;