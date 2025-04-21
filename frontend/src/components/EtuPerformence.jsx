import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getCorrection } from '../api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ClassPerformance = () => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bar');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCorrection();
        setCorrections(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculer les moyennes par exercice
  const exerciseStats = corrections.reduce((acc, curr) => {
    const exerciseId = curr.exercice;
    if (!acc[exerciseId]) {
      acc[exerciseId] = {
        total: 0,
        count: 0,
        exerciseId: exerciseId
      };
    }
    acc[exerciseId].total += curr.note;
    acc[exerciseId].count += 1;
    return acc;
  }, {});

  const exerciseAverages = Object.values(exerciseStats).map(ex => ({
    exerciseId: ex.exerciseId,
    average: ex.total / ex.count
  }));

  // Préparer les données pour les graphiques
  const chartData = {
    labels: exerciseAverages.map(ex => `Devoir ${ex.exerciseId}`),
    datasets: [
      {
        label: 'Moyenne de la classe',
        data: exerciseAverages.map(ex => ex.average),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance de la classe par exercice',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Moyenne: ${context.raw.toFixed(2)}/20`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        title: {
          display: true,
          text: 'Note /20'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Exercices'
        }
      }
    },
  };

  // Calcul de la moyenne générale
  const classAverage = exerciseAverages.reduce((sum, ex) => sum + ex.average, 0) / exerciseAverages.length || 0;

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">📊 Performances de la Classe</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : exerciseAverages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune donnée de performance disponible</p>
          </div>
        ) : (
          <>
            {/* Statistiques sommaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Devoir évalués</h3>
                <p className="text-3xl font-bold text-indigo-600">{exerciseAverages.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Moyenne générale</h3>
                <p className="text-3xl font-bold text-indigo-600">{classAverage.toFixed(2)}/20</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Meilleure moyenne</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {Math.max(...exerciseAverages.map(ex => ex.average)).toFixed(2)}/20
                </p>
              </div>
            </div>

            {/* Onglets de visualisation */}
            <div className="mb-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('bar')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bar' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Diagramme en barres
                </button>
                <button
                  onClick={() => setActiveTab('line')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'line' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Courbe de progression
                </button>
              </nav>
            </div>

            {/* Graphiques */}
            <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
              {activeTab === 'bar' ? (
                <Bar data={chartData} options={options} />
              ) : (
                <Line data={chartData} options={options} />
              )}
            </div>

            {/* Détails par exercice */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Détails par Devoir</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Devoir</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moyenne</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de copies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exerciseAverages.sort((a, b) => a.exerciseId - b.exerciseId).map((ex) => {
                      const exerciseData = exerciseStats[ex.exerciseId];
                      return (
                        <tr key={ex.exerciseId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Devoir {ex.exerciseId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ex.average >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {ex.average.toFixed(2)}/20
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {exerciseData.count} copie{exerciseData.count > 1 ? 's' : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ClassPerformance;