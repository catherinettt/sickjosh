'use strict';

var React = require('react');
var host = window.document.location.host.replace(/:.*/, '');
var ws = require('../ws-utils');

require('./register.less');

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    }
  }

  registerPlayer (e) {
    if (e.preventDefault) {
       e.preventDefault();
    }

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

    return Parse.User.logIn(playerName, playerName).then(() => {
      ws.registerPlayer();
      if (this.props.location.state && this.props.location.state.nextPathname) {
        this.props.history.replaceState(null, this.props.location.state.nextPathname)
      } else {
        this.props.history.replaceState(null, '/')
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
        this.props.history.replaceState(null, '/')
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
      <div className='js-register container-fluid'> 
        <h2>Player Registration</h2>
        <ul>
          <li>Please use your Hootsuite id</li>
          <li>Follow the rules</li>
          <li>Safely first</li>
        </ul>
        <form className='form-inline' onSubmit={this.registerPlayer.bind(this)}>
          <div className="form-group">
            <div className="input-group">
              <input ref="playerName" type="text" className="form-control" id="exampleInputAmount" placeholder="josh.gildart" />
              <div className="input-group-addon">@hootsuite.com</div>
            </div>
            </div>
        </form>
        {this.renderError()}
      </div>
    );
  }
}

module.exports = Register;