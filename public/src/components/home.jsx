'use strict';

var React = require('react');
require('./home.less');
var Chat = require('./chat');
var Status = require('./status');

import { Router, Route, Link } from 'react-router';

class Home extends React.Component {
  componentDidMount() {
   
  }
  render() {
    return (
      <div className='js-home'> 
        <Status {...this.props} />
        {this.props.children} 
        <Chat {...this.props} />
      </div>
    );
  }
}

module.exports = Home;