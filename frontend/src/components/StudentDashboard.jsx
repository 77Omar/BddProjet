import React from 'react';
import Layout from "../components/Layout"

const StudentDashboard = () => {
    return (
      <Layout>
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          🎓 Mon Espace Étudiant
        </h1>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform">
          + Nouvelle Soumission
        </button>
      </header>
  
      {/* Statistiques Perso */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-300 mb-1">Moyenne générale</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">15.2/20</p>
          <div className="h-1 bg-green-100 mt-2 rounded-full">
            <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-300 mb-1">Dernier exercice</p>
          <p className="text-3xl font-bold dark:text-white">17/20</p>
          <div className="flex items-center mt-2 text-yellow-500">
            ★★★★☆
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-300 mb-1">Progression</p>
          <p className="text-3xl font-bold dark:text-white">64%</p>
          <div className="radial-progress mt-2" style={{"--value":64}}>64%</div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-300 mb-1">Prochain rendu</p>
          <p className="text-3xl font-bold dark:text-white">3j</p>
          <div className="flex mt-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
            <span className="text-sm text-red-500">Urgent</span>
          </div>
        </div>
      </div>
  
      {/* Contenu Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique de performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">🚀 Évolution des notes</h2>
          <div className="h-64 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4">
            {/* Intégrer Chart.js ici */}
          </div>
        </div>
  
        {/* Feedback récents */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">💬 Derniers feedbacks</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div className="flex items-start">
                  <div className="mr-3 text-2xl">👨🏫</div>
                  <div>
                    <p className="font-medium dark:text-white">Exercice SQL n°{i+1}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">"Excellent travail ! Pensez à optimiser vos requêtes."</p>
                  </div>
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

export default StudentDashboard;