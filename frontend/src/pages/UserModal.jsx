import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../api';

const UserModal = ({ isOpen, onClose, user, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        role: 'etudiant',
        phone: '',
        is_active: true,
        password: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                password: '' // Réinitialiser le mot de passe
            });
        } else {
            // Réinitialiser le formulaire pour une nouvelle création
            setFormData({
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                role: 'etudiant',
                phone: '',
                is_active: true,
                password: ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            
            // Gestion du mot de passe
            if (user) {
                // Modification : utiliser PATCH et supprimer le mot de passe s'il est vide
                if (payload.password === '') {
                    delete payload.password;
                }
                await api.patch(`/api/users/${user.id}/`, payload);
            } else {
                // Création : mot de passe obligatoire
                await api.post('/api/users/', payload);
            }
            
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg relative">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold">
                        {user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nom d'utilisateur */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom d'utilisateur *
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>

                        {/* Prénom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Nom de famille */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nom de famille
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Téléphone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Téléphone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="+221 77 123 45 67"
                            />
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {user ? 'Nouveau mot de passe' : 'Mot de passe *'}
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required={!user}
                                placeholder={user ? "Laisser vide pour ne pas modifier" : ""}
                            />
                        </div>

                        {/* Rôle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rôle *
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="admin">Administrateur</option>
                                <option value="prof">Professeur</option>
                                <option value="etudiant">Étudiant</option>
                            </select>
                        </div>

                        {/* Statut Actif */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                id="is_active"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700">
                                Compte actif
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>  
            </div>
        </div>
    );
};

export default UserModal;