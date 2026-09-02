// frontend/src/components/Navbar.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth(); 

  // If the user is logged in, completely hide this top Navbar 
  // so the Dashboard can take over the entire screen.
  if (isAuthenticated) {
    return null; 
  }

  return (
    <nav className="top-navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <div className="brand-logo">H</div>
        <span className="brand-text">Habit Tracker</span>
      </div>

      <div className="nav-controls">
        <div className="public-menu">
          <button 
            className={`nav-btn ${location.pathname === '/login' ? 'active-text' : ''}`}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
          
          <button 
            className={`nav-btn primary-btn ${location.pathname === '/register' ? 'active-btn' : ''}`}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}

