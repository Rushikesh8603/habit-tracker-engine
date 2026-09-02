import { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import { Navigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);
      setMessage(response.data.message);
      setFormData({ username: '', email: '', password: '' });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-header">Create Account</h2>
        <p className="auth-subtitle">Start building better routines today.</p>

        {message && <div className="msg-success">{message}</div>}
        {error && <div className="msg-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            className="auth-input" 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={formData.username} 
            onChange={handleChange} 
            required 
          />
          <input 
            className="auth-input" 
            type="email" 
            name="email" 
            placeholder="Email address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            className="auth-input" 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button className="auth-button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

