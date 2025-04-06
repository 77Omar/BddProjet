import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../api';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const linkClass = (path) => 
    `flex items-center py-3 px-4 rounded-lg transition-all duration-300 ${
      location.pathname === path 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
        : 'text-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 hover:text-white hover:shadow-md'
    }`;

  const handleClick = () => {
    if (window.innerWidth < 768) {
      onClose?.();
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  // Menu items...
  const baseMenuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/utilisateurs", name: "Utilisateurs", icon: "👥" },
    { path: "/listExercices", name: "Exercices", icon: "📝" },
  ];

  const fullMenuItems = currentUser 
    ? [
        ...baseMenuItems,
        { path: `/etudiants/${currentUser.id}/notes`, name: "Mes Notes", icon: "✅" },
        { path: `/etudiants/${currentUser.id}/performances`, name: "Mes Performances", icon: "📈" },
        { path: "/mes_etudiant", name: "Mes Étudiants", icon: "👥" },
      ]
    : baseMenuItems;

  if (loading) {
    return (
      <div className="h-screen w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-700">
          <h2 className="text-xl font-bold text-white">Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-blue-800 to-indigo-900 text-white flex flex-col fixed left-0 top-0 z-50 shadow-xl">
      {/* Header avec dégradé inversé */}
      <div className="p-4 border-b border-indigo-700 bg-gradient-to-r from-indigo-600 to-blue-700">
        <h2 className="text-xl font-bold text-white">
          {currentUser ? `${currentUser.username}'s Dashboard` : 'Admin Dashboard'}
        </h2>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {fullMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleClick}
            className={linkClass(item.path)}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      {currentUser && (
        <div className="p-4 border-t border-indigo-700 text-sm bg-gradient-to-r from-blue-900 to-indigo-800">
          <p className="truncate text-gray-200">Connecté en tant que:</p>
          <p className="truncate font-medium text-white">{currentUser.username}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;