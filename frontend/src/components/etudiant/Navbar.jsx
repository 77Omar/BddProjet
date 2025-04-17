import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ toggleSidebar }) {
  return (
    <nav className="flex items-center justify-between bg-blue-800 text-white px-4 py-3 shadow-md relative">
      {/* Hamburger menu (mobile) */}
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="text-white text-3xl focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* Nom de l'étudiant centré */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <span className="italic text-lg font-semibold">Bienvenue, Étudiant</span>
      </div>

      {/* Liens à droite (desktop uniquement) */}
      <div className="hidden md:flex space-x-4 items-center ml-auto">
        <Link to="/profil" className="hover:underline">Mon Profil</Link>
        <Link to="/motdepasse" className="hover:underline">Mot de passe</Link>
        <button className="hover:underline">Déconnexion</button>
      </div>
    </nav>
  );
}

export default Navbar;
