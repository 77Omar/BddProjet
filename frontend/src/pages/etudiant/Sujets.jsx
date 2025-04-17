import React, { useState } from 'react';
import { FiCalendar, FiUser, FiBook, FiClock } from 'react-icons/fi';

function Sujets() {
  const [filterMatiere, setFilterMatiere] = useState('all');
  const [filterSemestre, setFilterSemestre] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const sujets = [
    { 
      id: 1,
      titre: 'Réseaux Informatiques', 
      description: 'Sujet sur les couches du modèle OSI et leur fonctionnement dans les réseaux modernes.', 
      datePublication: '2025-03-15',
      dateDebut: '2025-03-16',
      dateLimite: '2025-04-01',
      matiere: 'Informatique', 
      semestre: 'S1',
      professeur: 'Prof. Dupont',
      statut: 'disponible'
    },
    { 
      id: 2,
      titre: 'Base de Données', 
      description: 'Conception relationnelle et normalisation des schémas de base de données.', 
      datePublication: '2025-03-20', 
      dateDebut: '2025-03-21', 
      dateLimite: '2025-04-05', 
      matiere: 'Informatique', 
      semestre: 'S2', 
      professeur: 'Prof. Martin',
      statut: 'disponible'
    },
    { 
      id: 3,
      titre: 'Physique Quantique', 
      description: 'Principes fondamentaux de la physique quantique et applications modernes.', 
      datePublication: '2025-04-01', 
      dateDebut: '2025-04-02', 
      dateLimite: '2025-04-15', 
      matiere: 'Physique', 
      semestre: 'S1', 
      professeur: 'Prof. Girard',
      statut: 'bientôt'
    },
    { 
      id: 4,
      titre: 'Chimie Organique', 
      description: 'Étude des réactions organiques et mécanismes réactionnels.', 
      datePublication: '2025-04-05', 
      dateDebut: '2025-04-06', 
      dateLimite: '2025-04-20', 
      matiere: 'Chimie', 
      semestre: 'S2', 
      professeur: 'Prof. Lefevre',
      statut: 'bientôt'
    },
  ];

  // Filtrer les sujets
  const filteredSubjects = sujets.filter(sujet => {
    const matchesFilter = (filterMatiere === 'all' || sujet.matiere === filterMatiere) &&
                         (filterSemestre === 'all' || sujet.semestre === filterSemestre);
    
    const matchesSearch = sujet.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sujet.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Couleurs selon le statut
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'bientôt': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">Sujets Proposés</h2>
          <p className="text-gray-600">Parcourez les différents sujets disponibles pour vos travaux</p>
        </header>

        {/* Barre de filtres et recherche */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">Rechercher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Rechercher un sujet..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  value={filterMatiere}
                  onChange={(e) => setFilterMatiere(e.target.value)}
                >
                  <option value="all">Toutes les matières</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Physique">Physique</option>
                  <option value="Chimie">Chimie</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  value={filterSemestre}
                  onChange={(e) => setFilterSemestre(e.target.value)}
                >
                  <option value="all">Tous les semestres</option>
                  <option value="S1">Semestre 1</option>
                  <option value="S2">Semestre 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun sujet trouvé</h3>
            <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((sujet) => (
              <article key={sujet.id} className="bg-white overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(sujet.statut)}`}>
                      {sujet.statut === 'disponible' ? 'Disponible' : 'Bientôt disponible'}
                    </span>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {sujet.matiere} • {sujet.semestre}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{sujet.titre}</h3>
                  <p className="text-gray-600 mb-4">{sujet.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiUser className="mr-2 text-gray-400" />
                      <span>{sujet.professeur}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 text-gray-400" />
                      <span>Publié le {formatDate(sujet.datePublication)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 text-gray-400" />
                      <span>À rendre avant le {formatDate(sujet.dateLimite)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex justify-end">
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium ${sujet.statut === 'disponible' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-600 cursor-not-allowed'}`}
                    disabled={sujet.statut !== 'disponible'}
                  >
                    {sujet.statut === 'disponible' ? 'Choisir ce sujet' : 'Indisponible'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sujets;