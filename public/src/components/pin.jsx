'use strict';

var React = require('react');
var ws = require('../ws-utils');

var _ = require('underscore');

import { Router, Route, Link } from 'react-router';
require('./pin.less');

class Pin extends React.Component {
  constructor(props) {
    super();

    console.log(props);
  }

  _onBackClick() {
    this.props.history.replaceState(null, '/game');
  }

  _onPinSubmit() {
    var pin = React.findDOMNode(this.refs.pin).value;
    ws.submitInfection(pin);
  }

  render() {
    var {query} = this.props.location;

    console.log(query);

    return (
      <div className='rc-PinPad'>
        <button
          className='btn btn-default'
          onClick={this._onBackClick.bind(this)}>
          &laquo; Back
        </button>
        <input
          type="number"
          className="form-control -pinInput"
          ref="pin"
          placeholder={query.title} />
        <button
          className='btn btn-success'
          onClick={this._onPinSubmit.bind(this)}>Submit</button>
      </div>
    );
  }
}

module.exports = Pin;
