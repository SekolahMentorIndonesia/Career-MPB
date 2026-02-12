import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = (window.API_BASE_URL || '/backend') + '/api';

  // Helper for safe API calls
  const safeFetch = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;

    try {
      const response = await fetch(url, options);
      const text = await response.text();

      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('JSON Parse Error:', text.substring(0, 200));
        throw new Error('Server returned an invalid response (not JSON).');
      }

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Validate token on mount
    const validateToken = async () => {
      if (token) {
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            setUser(storedUser);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const result = await safeFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (result.status === 'success') {
        const { token, user } = result.data;
        setToken(token);
        setUser(user);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return user;
      } else {
        throw new Error(result.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const result = await safeFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (result.status === 'success') {
        return result.data; // May contain debug_otp
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const result = await safeFetch('/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (result.status === 'success') {
        return true;
      } else {
        throw new Error(result.message || 'Verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const setAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, verifyEmail, loading, isAuthenticated: !!token, updateUser, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

