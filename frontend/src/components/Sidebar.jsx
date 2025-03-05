// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="h-screen bg-blue-800 text-white w-64 p-4">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/accueil" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Accueil
          </Link>
        </li>
        <li>
          <Link to="/utilisateurs" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Utilisateurs
          </Link>
        </li>
        <li>
          <Link to="/api/roles" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Roles
          </Link>
        </li>
        <li>
          <Link to="/exercices" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Exercices
          </Link>
        </li>
        <li>
          <Link to="/corrections" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Corrections
          </Link>
        </li>
        <li>
          <Link to="/statistiques" className="block py-2 hover:bg-blue-700 px-4 rounded">
            Statistiques
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
