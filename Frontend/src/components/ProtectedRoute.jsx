import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  // Still checking localStorage for a saved token

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  // No token / not logged in = redirect to login.

  return children;
  // Logged in = render the protected page normally.
};

export default ProtectedRoute;