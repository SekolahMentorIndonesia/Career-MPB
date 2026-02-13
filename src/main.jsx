import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/ToastContainer';
import router from './router';
import './index.css';

// Define global API URL for production compatibility
if (!window.API_BASE_URL) {
  const hostname = window.location.hostname;
  window.API_BASE_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
    ? `http://${hostname}:8000`
    : window.location.origin + '/backend'; // Absolute path for production
}

// Ensure no trailing slash for consistency
if (window.API_BASE_URL.endsWith('/')) {
  window.API_BASE_URL = window.API_BASE_URL.slice(0, -1);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
);
