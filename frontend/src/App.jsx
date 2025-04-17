import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import des composants depuis le dossier components/etudiant
import Navbar from './components/etudiant/Navbar';
import Sidebar from './components/etudiant/Sidebar';
import Footer from './components/etudiant/Footer';

// Import des pages depuis le dossier pages/etudiant
import Dashboard from './pages/etudiant/Dashboard';
import Sujets from './pages/etudiant/Sujets';
import Soumettre from './pages/etudiant/Soumettre';
import Corrections from './pages/etudiant/Corrections';
import Notes from './pages/etudiant/Notes';
import MonProfil from './pages/etudiant/MonProfil';
import MotDePasse from './pages/etudiant/MotDePasse';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 w-full">
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sujets" element={<Sujets />} />
              <Route path="/soumettre" element={<Soumettre />} />
              <Route path="/corrections" element={<Corrections />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/profil" element={<MonProfil />} />
              <Route path="/motdepasse" element={<MotDePasse />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
