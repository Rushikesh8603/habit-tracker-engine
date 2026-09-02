import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth(); // Grab the global login function

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData, { withCredentials: true });
      
      const { accessToken, user } = response.data;

      // Update the GLOBAL state
      login(user, accessToken);

      // Instantly redirect the user to the Dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-header">Welcome Back</h2>
        <p className="auth-subtitle">Log in to track your habits.</p>

        {/* We only need to show the error message now */}
        {error && <div className="msg-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
          <button className="auth-button" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
