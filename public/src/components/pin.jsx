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
    this.props.history.replaceState(null, this.props.location.state.returnTo ? this.props.location.state.returnTo : '/game');
  }

  _onPinSubmit() {
    var pin = React.findDOMNode(this.refs.pin).value;
    ws.submitInfection(pin);
  }

  render() {
    var {query} = this.props.location;

    return (
      <div className='rc-PinPad modal' style={{'display': 'block'}}>
        <div className='modal-dialog'>
         <div className="modal-content">
            <div className="modal-header">
              {query.title}
              <button onClick={this._onBackClick.bind(this)} type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div className="modal-body">
              <input
                type="number"
                className="form-control -pinInput"
                ref="pin"
                placeholder='PIN' />
              <button
                className='btn btn-success'
                onClick={this._onPinSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Pin;
