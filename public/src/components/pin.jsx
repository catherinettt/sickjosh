'use strict';

var React = require('react');
var ws = require('../ws-utils');

var _ = require('underscore');

import { Router, Route, Link } from 'react-router';
require('./pin.less');

class Pin extends React.Component {
  constructor(props) {
    super();
  }

  _onBackClick() {
    this.props.onClose();
  }

  _onPinSubmit() {
    var pin = React.findDOMNode(this.refs.pin).value;
    var type = this.props.query.type;
    var callback = this.props.query.callback;

    if (pin && type) {
      var data = {
        pin: pin,
        type: type,
        callback
      };
      if (type == 'objective') {
        data.objectiveId = this.props.query.objectiveId;
      }
      // ws.submitPIN(data);
      this._verifyPin(data)
    }
  }

  _verifyPin(data) {
    if (data.type == 'objective') {
      var Objective = Parse.Object.extend("Objective");
      var query = new Parse.Query(Objective);
      query.equalTo('objectId', data.objectiveId);
      query.find().then((results) => {
        if (results.length) {
          var obj = results[0];
          if (obj.get('PIN') == data.pin) {
            if (obj.get('active')) {
              obj.set('active', false)
              obj.set('completed', true);
            }
            obj.save();
            ws.objectiveUpdate();
            this.props.onClose();
          }
        }
      });
    } else if (data.type === 'zombie') {
      var Zombie = Parse.Object.extend("Zombie");
      var query = new Parse.Query(Zombie);
      query.equalTo('PIN', parseInt(data.pin));
      query.first().then(result => {
          if (result) {
            var username = result.get('user').get('username');
            this.props.onClose();
            data.callback(username);
          } else {
            console.log('Incorrect Zombie PIN');
          }
      });
    }
  }

  render() {
    var query = this.props.query;

    return (
      <div className='rc-PinPad modal'>
        <div className='modal-backdrop' onClick={this._onBackClick.bind(this)}></div>
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
                maxLength={4}
                placeholder='PIN' />
              <button
                className='btn btn-success btn-lg btn-block'
                onClick={this._onPinSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Pin;
