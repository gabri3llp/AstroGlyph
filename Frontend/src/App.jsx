import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext.jsx';
import Navbar       from './components/Navbar.jsx';
import Landing      from './pages/Landing.jsx';
import Register     from './pages/Registration.jsx';
import Login        from './pages/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CheckedIn from './pages/CheckedIn.jsx';


const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>

<Route path="/" element={<Landing />} />
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
<Route path="/CheckedIn" element={
  
  <ProtectedRoute>
    <CheckedIn />
  </ProtectedRoute>

} />
<Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;