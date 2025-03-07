import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Role from './pages/Role';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import AdminDashboard from './pages/AdminDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Unauthorized from './pages/Unauthorized';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex">
      {!isAuthPage && isAuthenticated && <Sidebar />}
      <div className="flex-1">
        {!isAuthPage && isAuthenticated && <Navbar />}
        <div className="p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="/api/roles" element={<ProtectedRoute><Role /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          
            <Route
              path="/admin-dashboard"
              element={
                  <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                  </ProtectedRoute>
              }
            />
            <Route
              path="/professor-dashboard"
              element={
                <ProtectedRoute requiredRole="professor">
                  <ProfessorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
          
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        {() => {
                            const role = localStorage.getItem('USER_ROLE');
                            if (!role) return <Navigate to="/login" replace />;
                            return <Navigate to={`/${role}-dashboard`} replace />;
                        }}
                    </ProtectedRoute>
                }
            />
          
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
          
        </div>
      </div>
    </div>
  );
}

export default App;
