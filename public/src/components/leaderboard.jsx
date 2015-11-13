'use strict';

var React = require('react');
require('./tv.less');

import { Router, Route, Link } from 'react-router';

class LeaderBoard extends React.Component {
    constructor(props) {
        super();
    }

    renderLeaderBoard(title, data){
        return(
            <table>
                <th>{title}</th><th></th>
                <tbody>{this.renderPlayerRows(data)}</tbody>
            </table>
        );
    }

    renderPlayerRows(data){
        return data.map((player) => {
            return (
                <tr>
                    <td>{player.name}</td>
                    <td>{player.score}</td>
                </tr>
            )
        });
    }

    render() {
        return (
            this.renderLeaderBoard(this.props.title, this.props.data)
        );
    }
}

module.exports = LeaderBoard;
