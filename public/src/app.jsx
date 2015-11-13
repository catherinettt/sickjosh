'use strict'

import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

var ws = require('./ws-utils');

Parse.initialize("7G1t2t49i4pEZtkh7b8KfMUgqxCtJr4uS1YrP1gU", "HVYShhVkTZkj3eQJnN1ExJgEnxyyS8syiT89X5bP");

var requireAuth = (nextState, replaceState) => {
  if (!Parse.User.current()) {
    replaceState({ nextPathname: nextState.location.pathname }, '/register');
  } else {
    setTimeout(function() {
      ws.registerPlayer();
    }, 0);
  }
}

var requireAdmin= (nextState, replaceState) => {
  var user = Parse.User.current();
  if (user) {
    if (user.getUsername() !== 'ADMIN') {
      console.log("Not admin. Kicking you out.");
      replaceState({ nextPathname: nextState.location.pathname }, '/');
    }
  } else {
    replaceState({ nextPathname: nextState.location.pathname }, '/register');
  }
}

React.render((
  <Router>
    <Route path="/" component={require('./components/home')}>
      <Route path="admin" component={require('./components/admin')} onEnter={requireAdmin}/>
      <Route path="register" component={require('./components/register')} />
      <Route path="game" component={require('./components/game')} onEnter={requireAuth} />
      <Route path="zombie" component={require('./components/zombie')} onEnter={requireAuth} />
      <Route path="summary" component={require('./components/summary')} onEnter={requireAuth} />
      <Route path="pin" component={require('./components/pin')} onEnter={requireAuth} />
      <IndexRoute component={require('./components/lobby')} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('app'));
