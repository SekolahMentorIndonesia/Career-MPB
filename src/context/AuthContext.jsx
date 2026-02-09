import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock validation of token on mount
    const validateToken = async () => {
      if (token) {
        // In a real app, verify token with backend
        // Here we simulate decoding the token to get user info
        try {
          // Mock: Decode token logic
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            setUser(storedUser);
          } else {
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (error) {
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  const login = async (email, password) => {
    // Mock Login Logic
    // In real app: API call -> get JWT -> setToken
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          (email === 'admin@gmail.com' && password === '4dmin3s3mi01927') ||
          (email === 'user@gmail.com' && password === 'passw0rd12')
        ) {
          const mockToken = "mock-jwt-token-" + Math.random().toString(36).substr(2);
          let mockUser;

          if (email === 'admin@gmail.com') {
            mockUser = { email, role: 'HR', name: 'Admin HR' };
          } else {
            mockUser = { email, role: 'CANDIDATE', name: 'Regular User' };
          }

          setToken(mockToken);
          setUser(mockUser);
          
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
