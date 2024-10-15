import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import Message from '../components/Message';

function Register() {
  const [message, setMessage] = useState('');

  const handleRegister = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('User registered successfully');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Failed to register');
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <RegisterForm onRegister={handleRegister} />
      <Message message={message} />
    </div>
  );
}

export default Register;