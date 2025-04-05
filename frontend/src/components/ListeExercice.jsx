import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { getExercices } from "../api"

const ListeExercice = () => {
  const [exercices, setExercices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadExercices = async () => {
      try {
        const data = await getExercices()
        setExercices(data)
      } catch (error) {
        console.error("Erreur de chargement:", error)
      } finally {
        setLoading(false)
      }
    }
    loadExercices()
  }, [])

  const filtExos = exercices.filter(exercice =>
    exercice.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercice.professeur.toLowerCase().includes(searchTerm.toLowerCase())
  )
   /*  const filtExos = exercices.filter(exercice => {
      const searchLower = searchTerm.toLowerCase();
      const titreMatch = exercice.titre.toLowerCase().includes(searchLower);
      
      // Gère à la fois les objets et les IDs
      const profMatch = exercice.professeur 
        ? (exercice.professeur.username || '').toLowerCase().includes(searchLower)
        : false;
        
      return titreMatch || profMatch;
    }); */

  const handleViewFile = async (exerciceId) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    window.open(`${API_BASE_URL}/api/exercices/${exerciceId}/fichier/`, '_blank');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header avec bouton et recherche */}
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-800">Liste des exercices</h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un exercice..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
            <Link
              to="/exercices"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              + Nouvel Exercice
            </Link>
          </div>
        </div>

        {/* Tableau des exercices */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fichier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtExos.map((exercice) => (
                    <tr key={exercice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{exercice.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            {exercice.titre.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{exercice.titre}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {exercice.professeur?.username || 'Inconnu'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <button 
                        onClick={() => handleViewFile(exercice.id)}
                        className="text-blue-600 hover:underline cursor-pointer"
                        >
                        Voir le fichier
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(exercice.date_creation).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                        <Link 
                        to={`/exercices/${exercice.id}/reponse`} 
                        className="text-blue-600 hover:text-blue-900"
                        >
                        Répondre
                        </Link>

                          <Link
                            to={`/exercices/${exercice.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Éditer
                          </Link>
                          
                          <button
                            className="text-red-600 hover:text-red-900"
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
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">1</span> à <span className="font-medium">{filtExos.length}</span> sur <span className="font-medium">{exercices.length}</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Précédent
            </button>
            <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ListeExercice