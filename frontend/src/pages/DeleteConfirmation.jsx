import React from 'react';
import {deleteUser } from "../api";
const DeleteConfirmation = ({ isOpen, onClose, user, onSuccess }) => {
    const handleDelete = async () => {
        try {
            await deleteUser(user.id);
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
                <p className="text-gray-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer l'utilisateur {user?.first_name} {user?.last_name} ?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;