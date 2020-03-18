import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { SyncContextWithRoute } from './SyncContextWithRoute';
import { About } from './About';
import { Main } from './Main';

import './App.css';

const App = () => (
  <Router>
    <div className="Content">
      <Switch>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='*'>
          <SyncContextWithRoute>
            <Main />
          </SyncContextWithRoute>
        </Route>
      </Switch>
    </div>
  </Router>
)

export default App;
