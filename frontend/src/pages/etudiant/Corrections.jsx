import React, { useState } from 'react';
import { 
  FiDownload, 
  FiSearch, 
  FiBook, 
  FiUser, 
  FiCalendar,
  FiChevronDown,
  FiXCircle
} from 'react-icons/fi';

const Corrections = () => {
  const [filters, setFilters] = useState({
    matiere: 'all',
    semestre: 'all',
    search: ''
  });

  const correctionsData = [
    {
      id: 1,
      matiere: 'Mathématiques',
      professeur: 'Prof. Dupont',
      semestre: 'S1',
      date: '2023-05-15',
      commentaire: 'Très bon travail sur les dérivées, mais attention aux erreurs de calcul dans les intégrales.',
      fichier: 'maths_correction_s1.pdf'
    },
    {
      id: 2,
      matiere: 'Algorithmique',
      professeur: 'Prof. Martin',
      semestre: 'S2',
      date: '2023-06-10',
      commentaire: 'Bonne logique algorithmique mais complexité à améliorer. Voir commentaires détaillés page 4.',
      fichier: 'algo_correction_s2.pdf'
    }
  ];

  // Fonction de filtrage corrigée
  const filteredCorrections = correctionsData.filter(correction => {
    const matchesFilter = (filters.matiere === 'all' || correction.matiere === filters.matiere) &&
                         (filters.semestre === 'all' || correction.semestre === filters.semestre);
    
    const matchesSearch = correction.matiere.toLowerCase().includes(filters.search.toLowerCase()) || 
                         correction.professeur.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleDownload = (filename) => {
    console.log(`Téléchargement de ${filename}`);
    // Implémentation réelle du téléchargement irait ici
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Corrections</h1>
        
        {/* Barre de filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Barre de recherche */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Rechercher par matière ou professeur..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filtres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
              <div className="relative">
                <select
                  name="matiere"
                  value={filters.matiere}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none pl-3 pr-8 py-2"
                >
                  <option value="all">Toutes les matières</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Algorithmique">Algorithmique</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <div className="relative">
                <select
                  name="semestre"
                  value={filters.semestre}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 appearance-none pl-3 pr-8 py-2"
                >
                  <option value="all">Tous les semestres</option>
                  <option value="S1">Semestre 1</option>
                  <option value="S2">Semestre 2</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des corrections */}
        {filteredCorrections.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <FiBook className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Aucune correction trouvée</h3>
            <p className="text-gray-500 mt-1">Essayez de modifier vos critères de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCorrections.map(correction => (
              <div key={correction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{correction.matiere}</h2>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FiUser className="mr-2" />
                        <span>{correction.professeur}</span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {correction.semestre}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FiCalendar className="mr-2" />
                      <span>Ajouté le {formatDate(correction.date)}</span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-700">Commentaires :</h3>
                      <p className="text-gray-600 mt-1">{correction.commentaire}</p>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleDownload(correction.fichier)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <FiDownload className="mr-2" />
                        Télécharger la correction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Corrections;