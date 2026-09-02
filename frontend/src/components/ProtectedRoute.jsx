// frontend/src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  // 1. The bouncer asks the radio tower: "Is this user logged in?"
  const { isAuthenticated } = useAuth(); 

  // 2. If the answer is NO, kick them back to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the answer is YES, open the door and show them the page (the children)
  return children;
}