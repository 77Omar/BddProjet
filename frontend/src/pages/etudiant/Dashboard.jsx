import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Données pour le graphe de performances par matière (Bar chart)
  const performanceData = {
    labels: ['Mathématiques', 'Informatique', 'Physique', 'Chimie', 'Biologie'], // Matières
    datasets: [
      {
        label: 'Mes Notes',
        data: [16, 14, 18, 13, 15], // Mes notes
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Moyenne de la classe',
        data: [12, 14, 15, 13, 11], // Moyenne de la classe
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphe d'état des devoirs (Pie chart)
  const devoirsData = {
    labels: ['Rendus', 'En Cours', 'En Retard', 'Manquants'],
    datasets: [
      {
        data: [30, 15, 10, 5], // Devoirs rendus, en cours, en retard, manquants
        backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'], // Vert, Jaune, Rouge, Gris
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="p-4">
      {/* Titre */}
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Tableau de Bord - Performances et Devoirs</h1>

      {/* Conteneur des deux graphes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphe de performance par matière */}
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Performance par Matière</h2>
          <Bar data={performanceData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Mes Performances vs Moyenne de la Classe',
                font: {
                  size: 16,
                },
              },
              legend: {
                position: 'top',
              },
            },
          }} />
        </div>

        {/* Graphe de l'état des devoirs */}
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">État des Devoirs</h2>
          <Doughnut data={devoirsData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Rendu, En Cours, En Retard, Manquants',
                font: {
                  size: 16,
                },
              },
              legend: {
                position: 'top',
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
