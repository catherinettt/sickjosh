'use strict';

var React = require('react');
var ws = require('../ws-utils');
require('./zombie.less');
var _ = require('underscore');

class Zombie extends React.Component {
  constructor(props) {
    super();
    this.state = {
      userPin: ''
    }
  }

  componentDidMount() {
    var Zombie = Parse.Object.extend("Zombie");
    var query = new Parse.Query(Zombie);
    query.equalTo('user', Parse.User.current());
    query.first(function(z) {
      this.setState ({
        userPin: z.get('PIN')
      })
    }.bind(this));
  }

  render() {

    return (
        <div className='rc-game'>

          <div className="-zombie">


            <div className='infectionCard'>
              <div className='-title'>Infected!</div>
              <div className='-content u-flex x-justify'>

                <span>Patient ID#</span>

                <span className='-pincode'>{this.state.userPin}</span>{' '}

                <span className='overseerLogo'>
                <span className="glyphicon-stack -logo">
                  <i className='glyphicon glyphicon-certificate'></i>
                  <i className='glyphicon glyphicon-inner glyphicon-eye-open'></i>
                  <i className='glyphicon glyphicon-top glyphicon-globe'></i>
                </span><br />
                <span className='-text'>Global O</span>
                  </span>
              </div>
              <div className='-disclaimer'>
                You have tested positive for the ZB-13 Virus. Please show this identification to any persons you may come in contact with and all Global Overseer health professionals so we can help you get proper care. This identification card is property of Global Overseer International Inc., if you believe you've been misdiagnosed please call the Global Overseer Health emergency hot-line.
              </div>
              <div className='-footer'>
              </div>
            </div>


          </div>
        </div>
    );
  }
}

module.exports = Zombie;
