import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegexTest from './pages/RegexTest';
import SQLTest from './pages/SQLTest';
import AjaxTest from './pages/AjaxTest';

function Home() {
  return <h1>Welcome to the Test Pages</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <h1>Test Pages</h1>
        <ul>
          <li><Link to="/regex">Regex Test</Link></li>
          <li><Link to="/sql">SQL Test</Link></li>
          <li><Link to="/ajax">AJAX Test</Link></li>
        </ul>

        {/* RoutesでRouteをラップ */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regex" element={<RegexTest />} />
          <Route path="/sql" element={<SQLTest />} />
          <Route path="/ajax" element={<AjaxTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
