import React, { useState, useEffect } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import UrlApp from './UrlApp'
import AdminApp from './AdminApp'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const backEndUrl = import.meta.env.VITE_BACKEND_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); 

  

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${backEndUrl}/checkAuth`, {
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.isAuthenticated) {
          setIsAuthenticated(true);
          setRole(data.role);
        } else {
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuthStatus();
  }, []);

  const PrivateRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>; 
    if (!isAuthenticated){
       return <Navigate to="/" replace />;
    }
    return children;
  };

  
  const PublicRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>
    if (isAuthenticated) {
      return role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/urlapp" replace />;
    }
    return children;
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><Login setIsAuthenticated={setIsAuthenticated} role={role} /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          <Route path="/urlapp" element={
            <PrivateRoute>
              <UrlApp setIsAuthenticated={setIsAuthenticated} role={role} />
            </PrivateRoute>
          } />

          <Route path="/admin" element={
            <PrivateRoute>
              {role === "ADMIN" ? <AdminApp setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" replace />}
            </PrivateRoute>
          } />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
      </Router>
    </>
  );
}

export default App;
