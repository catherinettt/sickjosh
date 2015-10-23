'use strict';

var React = require('react');

import { Link } from 'react-router';

require('./admin.less')

var ws = require('../ws-utils');
var _ = require('underscore');

class Admin extends React.Component {
  constructor() {
    super();
    this.state = {
        registeredPlayers: {},
        countdown: {},
        safezones: {}
    }
    ws.adminReceiver = this.incomingMsg.bind(this);
  }

  componentDidMount() {
    var SafeZone = Parse.Object.extend("SafeZone");
    var query = new Parse.Query(SafeZone);
    query.include("map");
    query.find().then((results) => {
      if (results.length) {
        this.setState({
         safezones: results
        });
      }
    });
  }

  incomingMsg(message) {
    if (message.type === 'status') {
      this.setState({
        registeredPlayers: message.registeredPlayers
      })
    }
  }

  renderPlayers() {
    if (_.size(this.state.registeredPlayers)) {
      return _.map(this.state.registeredPlayers, (player) => {
        var zombie = player.zombie ? 'glyphicon glyphicon-tint' : 'glyphicon glyphicon-user';
        return (
          <div className='col-xs-4 -player' key={player.playerName}> 
             <span className={zombie}></span> <span>{player.playerName}</span>
          </div>
        )
      })
    }
  }

  renderSafezones() {
    if (this.state.safezones.length) {
      return this.state.safezones.map((zone) => {
        return (
          <div className='row' key={zone.id}> 
            <div className='col-xs-8'>
              {zone.get('map').get('name')} > {zone.get('name')} (Max: {zone.get('maxAllowance')})
            </div>
            <div className='col-xs-4'>
              <button className='btn btn-xs btn-default pull-right'>Activate</button> 
            </div>
          </div>
        )
      })
    }
  }

  render() {
    return (
      <div className='js-admin container-fluid'> 
        <div className='-players'>
          <h4>Players <small className='pull-right'><span className='glyphicon glyphicon-tint'></span>: infected</small> </h4>
          <div className='row'> 
            {this.renderPlayers()}
          </div>
        </div>
        <hr />
        <div className='-safezones'>
          <h4>Safezones</h4>
          {this.renderSafezones()}
        </div>
      </div>
    );
  }
}

module.exports = Admin;