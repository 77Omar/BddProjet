// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen }) {
  return (
    <div className={`bg-blue-900 text-white w-64 space-y-6 py-7 px-2 absolute md:relative inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out`}>
      <nav className="space-y-2">
        <Link to="/" className="block px-4 py-2 hover:bg-blue-700">Dashboard</Link>
        <Link to="/sujets" className="block px-4 py-2 hover:bg-blue-700">Sujets proposées</Link>
        <Link to="/soumettre" className="block px-4 py-2 hover:bg-blue-700">Soumettre devoirs</Link>
        <Link to="/corrections" className="block px-4 py-2 hover:bg-blue-700">Corrections</Link>
        <Link to="/notes" className="block px-4 py-2 hover:bg-blue-700">Mes Notes</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
