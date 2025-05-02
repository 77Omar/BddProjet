import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiUser } from 'react-icons/fi';
import api from '../api';
import UserModal from './UserModal';
import DeleteConfirmation from './DeleteConfirmation';
import Layout from '../components/Layout';
import { fetchUsers } from "../api";
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);
   
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const loadUsers = async () => {
              try {
                 fetchUsers();
              } catch (error) {
                console.error("Erreur de chargement:", error);
              } finally {
                setLoading(false);
              }
            };
            loadUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      // Pagination logic
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
      const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    
      const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/users/');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getRoleBadge = (role) => {
        const roleStyles = {
            admin: 'bg-purple-100 text-purple-800',
            professor: 'bg-blue-100 text-blue-800',
            student: 'bg-green-100 text-green-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm ${roleStyles[role]}`}>
                {role}
            </span>
        );
    };

    return (
    <Layout>
    <div className="space-y-6 p-4">

        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                    <button 
                        onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                        <FiUserPlus className="mr-2" /> Nouvel Utilisateur
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <span className="absolute left-3 top-2.5 text-gray-400">
                🔍
              </span>
            </div>
           
          </div>

         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {loading ? (
                <div className="p-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2">Chargement des utilisateurs...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur enregistré'}
                </div>
            ) : (
                <>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Utilisateur</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rôle</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentItems.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        
                                

                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                              {user.username.charAt(0).toUpperCase()}
                                           </div>
                                           <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-xs text-gray-500">ID: {user.id}</div>
                                            </div>
                                
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.is_active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-4">
                                        <button 
                                            onClick={() => { setSelectedUser(user); setIsModalOpen(true); }}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            <FiEdit size={20} />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteCandidate(user)}
                                            className="text-red-600 hover:text-red-900 transition-colors"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                 {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Affichage {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} sur {filteredUsers.length}
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

            <UserModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSuccess={fetchUsers}
            />

            <DeleteConfirmation 
                isOpen={!!deleteCandidate}
                onClose={() => setDeleteCandidate(null)}
                user={deleteCandidate}
                onSuccess={fetchUsers}
            />
        </div>
        </div>
        </div>
        </Layout>
    );
};

export default UserList;