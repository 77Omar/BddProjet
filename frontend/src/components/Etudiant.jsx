import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { fetchUsers } from "../api";
import { Link } from 'react-router-dom'

const Etudiant = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers()
        // Filtrer pour ne garder que les étudiants
        const students = data.filter(user => user.role === 'etudiant')
        setUsers(students)
      } catch (error) {
        console.error("Erreur de chargement:", error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header avec bouton et recherche */}
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Étudiants</h1>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un étudiant..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
            <Link
              to="/etudiants/ajouter"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center whitespace-nowrap"
            >
              + Ajouter un Étudiant
            </Link>
          </div>
        </div>

        {/* Tableau des étudiants */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2">Chargement des étudiants...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Aucun étudiant trouvé' : 'Aucun étudiant enregistré'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            <div className="text-xs text-gray-500">Étudiant</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                            <Link
                            to={`/etudiants/${user.id}/notes`}
                            className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-sm"
                            >
                            Notes
                            </Link>
                            <Link
                            to={`/etudiants/${user.id}/performances`}
                            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors shadow-sm"
                            >
                            Performances
                            </Link>
                            
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination - Optionnel */}
        {filteredUsers.length > 10 && (
          <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="text-sm text-gray-500">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">10</span> sur <span className="font-medium">{filteredUsers.length}</span>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Précédent
              </button>
              <button className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Etudiant