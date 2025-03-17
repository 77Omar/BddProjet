import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiUserPlus, FiUser } from 'react-icons/fi';
import api from '../api';
import UserModal from './UserModal';
import DeleteConfirmation from './DeleteConfirmation';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

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

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {user.avatar ? (
                                                <img 
                                                    src={user.avatar} 
                                                    className="h-10 w-10 rounded-full object-cover mr-4 border-2 border-gray-200"
                                                    alt={`Avatar de ${user.first_name} ${user.last_name}`}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 border-2 border-gray-200">
                                                    <FiUser className="text-gray-500 text-xl" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{user.first_name} {user.last_name}</p>
                                                <p className="text-gray-500">{user.email}</p>
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
    );
};

export default UserList;