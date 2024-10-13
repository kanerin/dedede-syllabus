// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import RegexTest from './components/RegexTest';
import SqlTest from './components/SqlTest';
import AjaxTest from './components/AjaxTest';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/regex-test" component={RegexTest} />
        <Route path="/sql-test" component={SqlTest} />
        <Route path="/ajax-test" component={AjaxTest} />
      </Switch>
    </Router>
  );
}

export default App;
