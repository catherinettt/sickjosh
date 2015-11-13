'use strict';

import {Link} from 'react-router'

var React = require('react');
var ws = require('../ws-utils');
var _ = require('underscore');

class GameProgress extends React.Component {

  _notifyInfected() {
    ws.playerInfected();
    this._redirect('/zombie');
  }

  _redirect(path) {
    this.props.history.replaceState(null, path);
  }

  render() {

    var zombiePercentage = (this.props.zombieCount / (this.props.survivorCount + this.props.zombieCount)) * 100;
    console.log("Zombie progress: "+ zombiePercentage);

    var objectivePercentage = (this.props.objectivesCompleted / this.props.objectivesTotal.length) * 100;
    console.log("Objective progress: ", objectivePercentage);

    return (
        <div className='-gameProgress'>
          <section className='-players'>
            <div className='-information x-justify'>
              <div className='-zombieCount'>
                <span className='glyphicon glyphicon-tint'></span> {this.props.zombieCount}
              </div>
              <div className="-actions">
                <button type="button" className="btn btn-danger" onClick={this._notifyInfected.bind(this)}> 
                  Ive been turned!
                </button>
              </div>
              <div className='-survivorCount'>
                <span className='glyphicon glyphicon-user'></span> {this.props.survivorCount}
              </div>
            </div>
            <div className="progress">
              <div className="progress-bar progress-bar-danger progress-bar-striped active" role="progressbar" style={{'width': zombiePercentage +'%'}}>
              </div>
            </div>
          </section>
          <section className='-objectives'>
            <div className='-information'>
              {this.props.objectivesCompleted} of {this.props.objectivesTotal.length} objectives completed
            </div>
            <div className="progress x-objectives">
              <div className="progress-bar progress-bar-primary progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style={{'width': objectivePercentage +'%'}}>
              </div>
              <span className="label label-primary -progress"></span>
            </div>
          </section>
        </div>
    );
  }
}

module.exports = GameProgress;
