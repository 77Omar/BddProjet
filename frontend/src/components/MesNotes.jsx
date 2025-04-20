import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { getMesCorrections, updateCorrection } from '../api';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const MesNotes = () => {
  const [corrections, setCorrections] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [displayedFeedback, setDisplayedFeedback] = useState('');
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const animationRef = useRef(null);
  const charIndexRef = useRef(0);

  useEffect(() => {
    const loadReponses = async () => {
      try {
        const data = await getMesCorrections(id);
        setCorrections(data.data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadReponses();
  }, [id]);

  const animateText = (text) => {
    charIndexRef.current = 0;
    setDisplayedFeedback('');
    
    animationRef.current = setInterval(() => {
      if (charIndexRef.current < text.length) {
        setDisplayedFeedback(prev => prev + text.charAt(charIndexRef.current));
        charIndexRef.current++;
      } else {
        clearInterval(animationRef.current);
      }
    }, 70); // Vitesse d'écriture (en ms)
  };

  const openFeedbackModal = (feedback) => {
    setSelectedFeedback(feedback || "Aucun feedback disponible");
    setIsFeedbackModalOpen(true);
    animateText(feedback || "Aucun feedback disponible");
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    clearInterval(animationRef.current);
    setDisplayedFeedback('');
  };

  const openEditModal = (correction) => {
    setSelectedCorrection(correction);
    setNewNote(correction.auto_note.toString());
    setIsEditModalOpen(true);
  };

  const handleNoteUpdate = async () => {
    try {
      const updatedCorrection = await updateCorrection(selectedCorrection.id, {
        note: parseFloat(newNote)
      });
      
      setCorrections(corrections.map(c => 
        c.id === selectedCorrection.id ? updatedCorrection.data : c
      ));
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

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
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => openEditModal(correction)}
                      className="p-1 text-white hover:text-yellow-300 transition"
                      title="Modifier la note"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <h2 className="text-sm sm:text-base font-bold mb-1">Devoir #{correction.exercice}</h2>
                  <p className="text-base sm:text-lg font-bold">
                    Note: <span className="text-yellow-300">{correction.note}/20</span>
                  </p>
                  <button
                    onClick={() => openFeedbackModal(correction.feedback_ia)}
                    className="mt-2 w-full px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-indigo-600 text-xs sm:text-sm font-medium rounded hover:bg-gray-100 transition"
                  >
                    Voir feedback
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Feedback avec animation */}
        <Dialog open={isFeedbackModalOpen} onClose={closeFeedbackModal} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-1 sm:p-4">
            <Dialog.Panel className="bg-white w-full max-w-xs sm:max-w-md mx-1 sm:mx-0 rounded-lg shadow-xl p-3 sm:p-4">
              <Dialog.Title className="text-base sm:text-lg font-bold mb-2">Feedback</Dialog.Title>
              <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto text-xs sm:text-sm">
                <p className="whitespace-pre-line text-gray-800 min-h-[100px]">
                  {displayedFeedback}
                  {charIndexRef.current < (selectedFeedback?.length || 0) && (
                    <span className="animate-pulse">|</span> // Curseur clignotant
                  )}
                </p>
              </div>
              <div className="mt-3 sm:mt-4 text-center">
                <button
                  onClick={closeFeedbackModal}
                  className="bg-indigo-500 text-white px-3 py-1 rounded text-sm sm:text-base hover:bg-indigo-600 transition"
                >
                  Fermer
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Modal Modification Note */}
        <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white w-full max-w-md rounded-lg shadow-xl p-6">
              <Dialog.Title className="text-lg font-bold mb-4">
                Modifier la note - Devoir #{selectedCorrection?.exercice}
              </Dialog.Title>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouvelle note (sur 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleNoteUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Enregistrer
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