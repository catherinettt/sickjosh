'use strict';

var React = require('react');
require('./home.less');
var Chat = require('./chat');

import { Router, Route, Link } from 'react-router';

class Home extends React.Component {
  componentDidMount() {
   
  }
  render() {
    return (
      <div className='js-home container-fluid'> 
        {this.props.children} 
        <Chat />
      </div>
    );
  }
}

module.exports = Home;