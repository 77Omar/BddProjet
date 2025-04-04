import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* ✅ Bouton Menu Mobile */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={onMenuClick} // ✅ Active la sidebar
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

        {/* ✅ Titre */}
        <h1 className="hidden md:block text-xl font-semibold text-gray-800">Tableau de Bord</h1>

        {/* ✅ Utilisateur + Déconnexion */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Admin</span>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            A
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

