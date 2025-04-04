// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  // Récupérer le rôle utilisateur du localStorage
  const userRole = localStorage.getItem('USER_ROLE') || 'student';
  
  // Définir le titre et les liens en fonction du rôle
  const sidebarConfig = {
    admin: {
      title: "Admin Dashboard",
      links: [
        { to: "/admin-dashboard", label: "Dashboard" },
        { to: "/accueil", label: "Accueil" },
        { to: "/api/users", label: "Utilisateurs" },
        { to: "/api/roles", label: "Roles" },
        { to: "/exercices", label: "Exercices" },
        { to: "/corrections", label: "Corrections" },
        { to: "/statistiques", label: "Statistiques" }
      ]
    },
    professor: {
      title: "Professeur Dashboard",
      links: [
        { to: "/professor-dashboard", label: "Dashboard" },
        { to: "/accueil", label: "Accueil" },
        { to: "/exercices", label: "Exercices" },
        { to: "/corrections", label: "Corrections" },
        { to: "/statistiques", label: "Statistiques" }
      ]
    },
    student: {
      title: "Étudiant Dashboard",
      links: [
        { to: "/student-dashboard", label: "Dashboard" },
        { to: "/accueil", label: "Accueil" },
        { to: "/exercices", label: "Mes Exercices" },
        { to: "/statistiques", label: "Mes Statistiques" }
      ]
    }
  };

  // Obtenir la configuration pour le rôle actuel (avec fallback sur student)
  const config = sidebarConfig[userRole] || sidebarConfig.student;

  return (
    <div className="h-screen bg-blue-800 text-white w-64 p-4">
      <h2 className="text-xl font-bold mb-4">{config.title}</h2>
      <ul>
        {config.links.map((link, index) => (
          <li key={index}>
            <Link to={link.to} className="block py-2 hover:bg-blue-700 px-4 rounded">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;