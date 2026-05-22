import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    // Tell the server we're sending JSON.
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('astroglyph_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('astroglyph_token');

      if (token) {
        try {
          const response = await api.get('/auth/me');

          setUser(response.data.user);
        } catch {
          localStorage.removeItem('astroglyph_token');
        }
      }

      setLoading(false);
    };

    restoreSession();
  }, []);


  const register = async (username, email, glyphSequence, glyphStarIds) => {


    const response = await api.post('/auth/register', {
      username,
      email,
      glyphSequence,
      glyphStarIds,
    });

    localStorage.setItem('astroglyph_token', response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  const login = async (email, glyphSequence) => {

    const response = await api.post('/auth/login', {
      email,
      glyphSequence,
    });

    localStorage.setItem('astroglyph_token', response.data.token);

    setUser(response.data.user);

    return response.data;
  };

  const logout = () => {

    localStorage.removeItem('astroglyph_token');

    setUser(null);
  };


  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};