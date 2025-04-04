import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const linkClass = (path) => 
    `flex items-center py-3 px-4 rounded transition-colors ${
      location.pathname === path 
        ? 'bg-blue-600 text-white'
        : 'text-blue-100 hover:bg-blue-700 hover:text-white'
    }`;

  const handleClick = () => {
    if (window.innerWidth < 768) {
      onClose();  // ✅ Ferme la sidebar sur mobile
    }
  };

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/utilisateurs", name: "Utilisateurs", icon: "👥" },
    { path: "/listExercices", name: "Exercices", icon: "📝" },
    { path: "/reponse", name: "Reponse", icon: "✅" },
    { path: "/statistiques", name: "Statistiques", icon: "📈" }
  ];

  return (
    <div className="h-screen w-64 bg-blue-800 text-white flex flex-col">
      <div className="p-4 border-b border-blue-700">
        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
      </div>
      
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={handleClick}
            className={linkClass(item.path)}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
