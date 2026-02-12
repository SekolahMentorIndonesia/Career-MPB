import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ToastContainer from './components/ToastContainer';
import router from './router';
import './index.css';

// Define global API URL for production compatibility
const hostname = window.location.hostname;
window.API_BASE_URL = (hostname === 'localhost' || hostname === '127.0.0.1')
  ? `http://${hostname}:8000`
  : '/backend'; // Production path (relative to root)

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
