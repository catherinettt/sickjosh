'use strict'

import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

var ws = require('./ws-utils');

Parse.initialize("7G1t2t49i4pEZtkh7b8KfMUgqxCtJr4uS1YrP1gU", "HVYShhVkTZkj3eQJnN1ExJgEnxyyS8syiT89X5bP");

var requireAuth = (nextState, replaceState) => {
	if (!Parse.User.current()) {
		replaceState({ nextPathname: nextState.location.pathname }, '/register');
	} else {
    setTimeout(() => {
      ws.registerPlayer();
    }, 500)
	}
}

React.render((
  <Router>
    <Route path="/" component={require('./components/home')}>
      <Route path="admin" component={require('./components/admin')} />
    	<Route path="register" component={require('./components/register')} />
    	<IndexRoute component={require('./components/lobby')} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('app'));