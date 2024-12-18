// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'; 
import RegexTest from './pages/RegexTest';
import SQLTest from './pages/SQLTest';
import AjaxTest from './pages/AjaxTest';
import LoginForm from './components/LoginForm';
import Message from './components/Message';
import Register from './pages/Register';
import ResultPage from './pages/ResultPage'; 
import MyPage from './pages/MyPage';
import Admin from './pages/Admin'; 
import ApplyTest from './pages/ApplyTest'; // 受験申請ページのインポート


import NavBar from './components/NavBar'; 

function Home() {
  return <h1>Welcome to the Test Pages</h1>;
}

function App() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsLoggedIn(true);
      setUsername(username);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('user_id', data.user_id);

        setMessage(`Welcome, ${data.username}!`);
        setIsLoggedIn(true);
        setUsername(data.username);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setMessage('Logged out successfully');
  };

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regex" element={<RegexTest />} />
          <Route path="/sql" element={<SQLTest />} />
          <Route path="/ajax" element={<AjaxTest />} />
          <Route path="/login" element={
            <div>
              <LoginForm onLogin={handleLogin} />
              <Message message={message} />
            </div>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/results" element={<ResultPage />} />
          {isLoggedIn && <Route path="/mypage" element={<MyPage />} />}
          {isLoggedIn && <Route path="/admin" element={<Admin />} />} {/* 管理者ページのルート */}
          <Route path="/apply/:testId" element={<ApplyTest />} /> {/* 受験申請ページのルート */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;