import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès Refusé</h1>
            <p className="text-gray-700 mb-4">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
            >
                Retour à l'accueil
            </Link>
        </div>
    </div>
);

export default Unauthorized;