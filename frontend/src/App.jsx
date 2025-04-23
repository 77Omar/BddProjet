import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";
import api from "./api";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import ExercicePage from './pages/ExercicePage';
import ListExoPage from './pages/ListExoPage';
import ReponsePage from './pages/ReponsePage';
import MesNotesPage from './pages/MesNotesPage';
import MaPerformencePage  from './pages/MaPerformencePage';
import EtudiantPage  from './pages/EtudiantPage';
import EtuPerformencePage  from './pages/EtuPerformencePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardAdminPage from './pages/DashboardAdminPage';
import DashboardEtudiantPage from './pages/DashboardEtudiantPage';
import DashboardProfPage from './pages/DashboardProfPage';
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
  const role =  localStorage.getItem("role")

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("api/auth/refresh/", { refresh: refreshToken });
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
             <Route path="/login" element={<LoginPage />} />
             <Route path="/register" element={<RegisterPage />} />

              {role==="etudiant" && (
                <>
                 <Route path="/dashboardEtu" element={<DashboardEtudiantPage />} />
                  <Route path="/exercices/:id/reponse" element={<ReponsePage />} />

                </>
              )

              }
            
            {role==="prof" &&(
              <>
             <Route path="/dashboardProf" element={<DashboardProfPage />} />
             <Route path="/exercices" element={<ExercicePage />} />

              </>
            )

            }
             <Route path="/mes_etudiant" element={<EtudiantPage />} />
            {role==="admin" &&(
              <>
              <Route path="/dashboardAdmin" element={<DashboardAdminPage />} />
               <Route path="/utilisateurs" element={<UsersPage />} />

              </>
            )

            }
             
             <Route path="/listExercices" element={<ListExoPage />} />
             <Route path="/etudiants/:id/notes" element={<MesNotesPage />} />
             <Route path="/etudiants/:id/performances" element={<MaPerformencePage />} />
             <Route path="/performances_des_etudiants" element={<EtuPerformencePage />} />

            <Route path="*" element={<NotFound />} /></Routes>
             <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default App;
