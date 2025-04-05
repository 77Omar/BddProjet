import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getCorrection } from '../api';
import Layout from '../components/Layout';

const MesNotes = () => {
  const [corrections, setCorrections] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExercices = async () => {
      try {
        const data = await getCorrection();
        setCorrections(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadExercices();
  }, []);

  const openModal = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-3 sm:p-6">
        <h1 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-8 text-center">📘 Mes Corrections</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : corrections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm sm:text-base">Aucune correction disponible</p>
          </div>
        ) : (
          <div className="w-full mx-auto px-1 sm:px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {corrections.map((correction) => (
                <div
                  key={correction.id}
                  className="relative bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg p-3 sm:p-4 shadow-md hover:shadow-lg transition-all"
                >
                  <h2 className="text-sm sm:text-base font-bold mb-1">Devoir #{correction.exercice}</h2>
                  <p className="text-base sm:text-lg font-bold">
                    Note: <span className="text-yellow-300">{correction.auto_note}/20</span>
                  </p>
                  <button
                    onClick={() => openModal(correction.feedback_ia)}
                    className="mt-2 w-full px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-indigo-600 text-xs sm:text-sm font-medium rounded hover:bg-gray-100 transition"
                  >
                    Voir feedback
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal optimisé mobile */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-1 sm:p-4">
            <Dialog.Panel className="bg-white w-full max-w-xs sm:max-w-md mx-1 sm:mx-0 rounded-lg shadow-xl p-3 sm:p-4">
              <Dialog.Title className="text-base sm:text-lg font-bold mb-2">Feedback</Dialog.Title>
              <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
                <p className="whitespace-pre-line text-gray-800">
                  {selectedFeedback || "Aucun feedback disponible"}
                </p>
              </div>
              <div className="mt-3 sm:mt-4 text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm sm:text-base"
                >
                  Fermer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MesNotes;