'use strict';

var React = require('react');
var ws = require('../ws-utils');

import { Router, Route, Link } from 'react-router';

require('./status.less');

// Examples:
//<Timer timeRemaining={this.state.timeRemaining / 1000} />
//<Timer startTime={1000} isActive={false} />

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: this.props.startTime || this.props.timeRemaining
    }
  }

  componentDidMount() {
    if (this.props.isActive) {
      setInterval(() => {
          this.setState({
            currentTime: (this.state.currentTime - 1)
          });
        },
          1000
      )
    }
  }

  componentWillReceiveProps() {
    if (this.props.timeRemaining) {
      this.setState({
        currentTime: this.props.timeRemaining
      });
    }
  }


  render() {
    return (
      <div style={{fontSize: '50px'}}>
        {this.state.currentTime}
      </div>
    );
  }
}


module.defaultProps = {
  isActive: false
};

module.exports = Timer;