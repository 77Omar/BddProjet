import React from "react";

const Dashboard = () => {
  return (
    <div className="flex-1 p-8">
      {/* Header - Suppression des boutons en double */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Tableau de Bord</h1>
      </header>

      {/* Statistiques Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Total des Soumissions</h2>
          <p className="text-3xl text-gray-700">150</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Moyenne des Notes</h2>
          <p className="text-3xl text-gray-700">15/20</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Exercices Corrigés</h2>
          <p className="text-3xl text-gray-700">120</p>
        </div>
      </section>

      {/* Section Graphique */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Performance des Étudiants
        </h2>
        <div className="bg-white p-6 rounded-lg shadow h-64 flex items-center justify-center">
          <span className="text-gray-500">Graphique des performances (ex: Chart.js)</span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
