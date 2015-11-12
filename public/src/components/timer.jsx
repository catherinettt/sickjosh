'use strict';

var React = require('react');
var ws = require('../ws-utils');

import { Router, Route, Link } from 'react-router';

require('./timer.less');

// Example:
//<Timer timeRemaining={this.state.timeRemaining / 1000} />

class Timer extends React.Component {
  constructor(props) {
    super(props);
    console.log('Timer constructor called');
  }

  render() {
    console.log('Rendering timer with timeRemaining: '+this.props.timeRemaining);
    return (
      <div style={{fontSize: '50px'}}>
        {this.props.timeRemaining}
      </div>
    );
  }
}

module.exports = Timer;
