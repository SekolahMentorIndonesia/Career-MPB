import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextObject';
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = `http://${window.location.hostname}:8000/api`;

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
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

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
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const result = await response.json();

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
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const result = await response.json();

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

  const updateUser = (newUserData) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, verifyEmail, loading, isAuthenticated: !!token, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

