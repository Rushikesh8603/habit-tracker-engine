import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Navbar from './components/Navbar';
import Register from './pages/Register';


;

import Login from './pages/LoginPage';

import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';



function App() {

  return (
    <BrowserRouter>
      <div className="app-wrapper">

        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* The Dashboard is wrapped in the Bouncer! */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
