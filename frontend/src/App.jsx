import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Role from './pages/Role';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";
import api from "./api";

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
        setIsAuthenticated(true); // Mettre à jour l'état pour afficher la bonne vue
      } else {
        setIsAuthenticated(false); // Si l'authentification échoue, déconnecter l'utilisateur
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthenticated(false); // Utilisateur non authentifié
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken(); // Si le token est expiré, rafraîchir
    } else {
      setIsAuthenticated(true); // Si le token est valide, rester authentifié
    }
  };

  useEffect(() => {
    // Vérifier l'authentification à chaque changement de location
    checkAuth();
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex">
      {/* Afficher Sidebar et Navbar uniquement si l'utilisateur est authentifié et n'est pas sur la page de login ou register */}
      {!isAuthPage && isAuthenticated && <Sidebar />}
      <div className="flex-1">
        {/* Afficher Navbar uniquement si l'utilisateur est authentifié et n'est pas sur la page de login ou register */}
        {!isAuthPage && isAuthenticated && <Navbar />}
        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="/api/roles" element={<ProtectedRoute><Role /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
