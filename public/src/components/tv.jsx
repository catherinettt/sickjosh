'use strict';

var React = require('react');
require('./tv.less');
var LeaderBoard = require('./leaderboard');
var GameProgress = require('./game');
//var ws = require('../ws-utils');

var leaderBoards = {
    user: [
        {name: "Shane", score: 500},
        {name: "Eric", score: -1},
        {name: "Joan", score: -50},
        {name: "Cat", score: -100}
    ],
    infected: [
        {name: "Shane", score: 500},
        {name: "Eric", score: -1},
        {name: "Joan", score: -50},
        {name: "Cat", score: -100}
    ],
    objectives : [
        {name: "Shane", score: 500},
        {name: "Eric", score: -1},
        {name: "Joan", score: -50},
        {name: "Cat", score: -100}
    ]
};

import { Router, Route, Link } from 'react-router';

class TV extends React.Component {
    constructor(props) {
        super();

        this.state = {
            leaderBoards: leaderBoards
        }
    }

    getLeaderBoards(){
        var LeaderBoards = Parse.Object.extend("Leaderboard");
        var query = new Parse.Query(Objective);
    }

    render() {
        return (
            <div className='js-tv'>
                <div className='background-image' />
                <div className='content'>
                    <div className='-information'>
                        0 of 8 objectives completed
                    </div>
                    <div className='leader-boards'>
                        <LeaderBoard title="Most Objectives" data={this.state.leaderBoards.user} />
                        <LeaderBoard title="Best Zombies" data={this.state.leaderBoards.user} />
                        <LeaderBoard title="Top Survivors" data={this.state.leaderBoards.user} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = TV;
