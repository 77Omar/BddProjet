import React, { useState } from 'react';
import { FiUser, FiMail, FiBook, FiCalendar, FiEdit, FiAward, FiBarChart2, FiSettings } from 'react-icons/fi';

const MonProfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    nom: 'Jean Dupont',
    email: 'jean.dupont@universite.fr',
    classe: 'Master 1 Informatique',
    promotion: '2023-2024',
    specialite: 'Intelligence Artificielle',
    dateNaissance: '15/03/1999',
    bio: 'Passionné par le machine learning et le développement web. Actuellement en recherche de stage.'
  });

  const stats = [
    { label: 'Moyenne générale', value: '15.2', icon: <FiBarChart2 className="text-blue-500" /> },
    { label: 'Sujets complétés', value: '24', icon: <FiBook className="text-green-500" /> },
    { label: 'Certifications', value: '5', icon: <FiAward className="text-purple-500" /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Ici vous ajouteriez la logique pour sauvegarder les modifications
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Colonne de gauche - Photo et stats */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-24"></div>
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="flex justify-center">
                  <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                    <FiUser className="text-gray-400 text-4xl" />
                  </div>
                </div>
                <h2 className="text-center text-xl font-bold mt-4 text-gray-800">{profile.nom}</h2>
                <p className="text-center text-blue-600">{profile.classe}</p>
                
                <div className="mt-6 space-y-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-white shadow-sm mr-3">
                          {stat.icon}
                        </div>
                        <span className="text-gray-600">{stat.label}</span>
                      </div>
                      <span className="font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <FiSettings className="mr-2 text-blue-500" />
                Paramètres rapides
              </h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiEdit className="mr-2" />
                {isEditing ? 'Annuler les modifications' : 'Modifier mon profil'}
              </button>
            </div>
          </div>

          {/* Colonne de droite - Détails du profil */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-16 flex items-center px-6">
                <h2 className="text-xl font-bold text-white">Informations du profil</h2>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <input
                        type="text"
                        name="nom"
                        value={profile.nom}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                      <input
                        type="text"
                        name="classe"
                        value={profile.classe}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                      <input
                        type="text"
                        name="specialite"
                        value={profile.specialite}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <FiUser className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Nom complet</p>
                        <p className="font-medium">{profile.nom}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiMail className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{profile.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiBook className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Classe</p>
                        <p className="font-medium">{profile.classe}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiAward className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Spécialité</p>
                        <p className="font-medium">{profile.specialite}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Promotion</p>
                        <p className="font-medium">{profile.promotion}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Date de naissance</p>
                        <p className="font-medium">{profile.dateNaissance}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-3">À propos</h3>
                    <p className="text-gray-600">{profile.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonProfil;