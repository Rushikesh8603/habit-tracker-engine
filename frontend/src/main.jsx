import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // 1. Import the Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the App inside the Provider */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

