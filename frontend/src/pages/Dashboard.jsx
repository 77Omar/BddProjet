import React from "react"
import Layout from "../components/Layout"

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-semibold text-gray-800">Tableau de Bord</h1>
        </header>

        {/* Statistiques Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Total des Soumissions", value: "150", color: "blue" },
            { title: "Moyenne des Notes", value: "15/20", color: "purple" },
            { title: "Exercices Corrigés", value: "120", color: "indigo" }
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/30"
            >
              <h2 className="text-xl font-bold mb-2 text-gray-700">{item.title}</h2>
              <p className={`text-3xl font-bold text-${item.color}-600`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Section Graphique */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Performance des Étudiants
          </h2>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-white/30 h-64 flex items-center justify-center">
            <span className="text-gray-500">Graphique des performances</span>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Dashboard