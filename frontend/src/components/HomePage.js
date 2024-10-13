// HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>試験ページ一覧</h1>
      <ul>
        <li><Link to="/regex-test">正規表現テスト</Link></li>
        <li><Link to="/sql-test">SQLテスト</Link></li>
        <li><Link to="/ajax-test">AJAXテスト</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;
