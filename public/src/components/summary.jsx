'use strict';

var React = require('react');
var ws = require('../ws-utils');
require('./zombie.less');
var _ = require('underscore');

class Summary extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    debugger;
    return (
        <div className='rc-summary'>

            <div className="">
                Zombie
            </div>
        </div>
    );
  }
}

module.exports = Summary;
