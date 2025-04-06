import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { getCorrection } from '../api';
import { Bar, Line } from 'react-chartjs-2';
import { useNavigate, useParams } from 'react-router-dom';

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

// Enregistrer les composants ChartJS
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

const EtuPerformence = () => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bar');
  const { id } = useParams();
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

  // Préparer les données pour le graphique
  const chartData = {
    labels: corrections.map(c => `Exercice ${c.exercice}`),
    datasets: [
      {
        label: 'Notes obtenues',
        data: corrections.map(c => c.auto_note),
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
        text: 'Performance par exercice',
      },
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

  // Calculer la moyenne
  const average = corrections.reduce((acc, curr) => acc + curr.auto_note, 0) / corrections.length || 0;

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 text-indigo-600">📊 Mes Performances</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : corrections.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune donnée de performance disponible</p>
          </div>
        ) : (
          <>
            {/* Statistiques sommaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Exercices complétés</h3>
                <p className="text-3xl font-bold text-indigo-600">{corrections.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Moyenne générale</h3>
                <p className="text-3xl font-bold text-indigo-600">{average.toFixed(2)}/20</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-gray-500">Meilleure note</h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {Math.max(...corrections.map(c => c.auto_note))}/20
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
            <div className="bg-white p-4 rounded-lg shadow-lg">
              {activeTab === 'bar' ? (
                <Bar data={chartData} options={options} />
              ) : (
                <Line data={chartData} options={options} />
              )}
            </div>

            {/* Détails des exercices */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Détail par exercice</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exercice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {corrections.map((correction) => (
                      <tr key={correction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Exercice {correction.exercice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${correction.auto_note >= 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {correction.auto_note}/20
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(correction.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
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

export default EtuPerformence;