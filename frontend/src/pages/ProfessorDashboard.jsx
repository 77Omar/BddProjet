import React from 'react';
import Layout from "../components/Layout"

const ProfessorDashboard = () =>{
  return (
    <Layout>
    <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          👨🏫 Tableau de Bord Professeur
        </h1>
       
      </header>
  
      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <div className="text-4xl mb-2">📥</div>
            <p className="text-gray-500 dark:text-gray-300 mb-1">Soumissions en attente</p>
            <p className="text-3xl font-bold dark:text-white">24</p>
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-300 mb-1">Moyenne générale</p>
            <p className="text-3xl font-bold dark:text-white">14.5/20</p>
          </div>
        </div>
  
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform">
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <p className="text-gray-500 dark:text-gray-300 mb-1">Délai moyen</p>
            <p className="text-3xl font-bold dark:text-white">2.3j</p>
          </div>
        </div>
      </div>
  
      {/* Section Principale */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">📚 Performance des étudiants</h2>
          <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4">
            {/* Intégrer Chart.js ici */}
          </div>
        </div>
  
        {/* Dernières soumissions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">📮 Dernières soumissions</h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <div>
                  <p className="font-medium dark:text-white">Étudiant {i+1}</p>
                  <p className="text-sm text-gray-500">Exercice de SQL</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm">
                    En attente
                  </span>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full transition-colors">
                    ▶️
                  </button>
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

export default ProfessorDashboard;