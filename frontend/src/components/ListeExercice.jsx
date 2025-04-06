import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { getExercices } from "../api";

const ListeExercice = () => {
  const [exercices, setExercices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadExercices = async () => {
      try {
        const data = await getExercices();
        setExercices(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExercices();
  }, []);

  const filteredExercices = exercices.filter(exercice =>
    exercice.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exercice.professeur?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExercices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExercices.length / itemsPerPage);

  const handleViewFile = async (exerciceId) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    window.open(`${API_BASE_URL}/api/exercices/${exerciceId}/fichier/`, '_blank');
  };

  const confirmDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet exercice ?")) {
      // Ajoutez ici la logique de suppression
      console.log("Suppression de l'exercice", id);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="space-y-6 p-4">
        {/* Header avec bouton et recherche */}
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Liste des exercices</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
                }}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
            <Link
              to="/exercices"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center whitespace-nowrap flex items-center justify-center"
            >
              <span className="mr-1">+</span> Nouvel Exercice
            </Link>
          </div>
        </div>

        {/* Tableau des exercices */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Chargement des exercices...</p>
            </div>
          ) : filteredExercices.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aucun exercice trouvé' : 'Aucun exercice disponible'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fichier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((exercice) => (
                      <tr key={exercice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {exercice.titre.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{exercice.titre}</div>
                              <div className="text-xs text-gray-500">ID: {exercice.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {exercice.professeur?.username || 'Non attribué'}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleViewFile(exercice.id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                          >
                            Voir le fichier
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(exercice.date_creation).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-4">
                            <Link 
                              to={`/exercices/${exercice.id}/reponse`} 
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              Répondre
                            </Link>
                            <Link
                              to={`/exercices/${exercice.id}/edit`}
                              className="text-green-600 hover:text-green-800 hover:underline"
                            >
                              Éditer
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-800 hover:underline"
                              onClick={() => confirmDelete(exercice.id)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination améliorée */}
              {totalPages > 1 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredExercices.length)} sur {filteredExercices.length}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ListeExercice;