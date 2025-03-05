import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center bg-white shadow p-4">
      <h1 className="text-xl font-semibold text-gray-800">Plateforme</h1>
      <div className="flex space-x-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Profil
        </button>
        <button
          onClick={handleLogout}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default Navbar;
