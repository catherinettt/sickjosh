'use strict';

var React = require('react');
var ws = require('../ws-utils');
require('./zombie.less');
var _ = require('underscore');

class Zombie extends React.Component {
  constructor(props) {
    super();
  }

  render() {
      return (
          <div className='rc-game'>

              <div className="-zombie">
                  Zombie
              </div>
          </div>
      );
  }
}

module.exports = Zombie;
