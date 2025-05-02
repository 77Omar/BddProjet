import React from 'react';
import Layout from "../components/Layout"

const AdminDashboard = () => {
  return (
    <Layout>
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🛠️ Tableau de Bord Administrateur
        </h1>
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-lg">
          Système Actif ✅
        </div>
      </header>
  
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg mr-4">
              👥<span className="text-indigo-600 text-2xl"></span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-300">Utilisateurs</p>
              <p className="text-3xl font-bold dark:text-white">1,234</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              📚<span className="text-green-600 text-2xl"></span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-300">Exercices Actifs</p>
              <p className="text-3xl font-bold dark:text-white">89</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              ⚠️<span className="text-red-600 text-2xl"></span>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-300">Stockage Utilisé</p>
              <p className="text-3xl font-bold dark:text-white">64%</p>
            </div>
          </div>
        </div>
      </div>
  
      {/* Graphique et Activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">📈 Performance du Système</h2>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4">
            {/* Intégrer Chart.js ici */}
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">📋 Activité Récente</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  ✅
                </div>
                <div>
                  <p className="font-medium dark:text-white">Nouvel utilisateur enregistré</p>
                  <p className="text-sm text-gray-500">2 min ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </Layout>
    )
  }

export default AdminDashboard;