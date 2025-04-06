import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg fixed top-0 left-0 right-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-30">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Bouton Menu Mobile - Toujours visible sur mobile */}
        <button
          className="p-2 rounded-md text-white hover:bg-white/20 focus:outline-none transition-colors"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          {sidebarOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Conteneur du texte défilant - Adapté pour mobile */}
        <div className="mx-2 flex-1 overflow-hidden">
          <div className="relative w-full">
            <h1 className="text-sm md:text-xl font-semibold text-white italic whitespace-nowrap animate-marquee">
              Plateforme intelligente d'évaluation automatisée des exercices
            </h1>
          </div>
        </div>

        {/* Bouton Déconnexion */}
        <button
          onClick={handleLogout}
          className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
        >
          <span className="hidden md:inline">Déconnexion</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

    </header>
  );
};

export default Navbar;