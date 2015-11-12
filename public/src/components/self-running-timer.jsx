'use strict';

var React = require('react');
var ws = require('../ws-utils');

import { Router, Route, Link } from 'react-router';

var Timer = require('./timer.jsx');

// Examples:
//<SelfRunningTimer startTime={1000} />

class SelfRunningTimer extends React.Component {
  constructor(props) {
    super(props);
    console.log('SelfRunningTimer constructor called');

    this.state = {
      currentTime: this.props.startTime
    }
  }

  componentDidMount() {
    setInterval(() => {
        this.setState({
          currentTime: (this.state.currentTime - 1)
        });
      },
        1000
    )
  }

  render() {
    return (
      <Timer timeRemaining={this.state.currentTime} />
    );
  }
}

module.exports = SelfRunningTimer;
