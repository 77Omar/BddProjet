import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { createCorrection, getCurrentUser } from '../api'; // Nouvelle API pour Correction
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReponseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID de l'exercice
  const [formData, setFormData] = useState({
    fichier: null,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error);
        navigate('/login');
      }
    };
    loadUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { files } = e.target;
    setFormData({ fichier: files ? files[0] : null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError("Vous devez être connecté pour soumettre une réponse");
      return;
    }

    if (!formData.fichier) {
      setError("Veuillez ajouter un fichier PDF");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('exercice', id); // ID de l'exercice
      formDataToSend.append('etudiant', currentUser.id);
      formDataToSend.append('fichier_reponse', formData.fichier);

      await createCorrection(formDataToSend);
      toast.success('Reponse enregistrer avec succès !', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate(`/etudiants/${currentUser.id}/notes`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi de la réponse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Soumettre une réponse</h1>
          <p className="text-sm text-gray-500">Exercice ID: {id}</p>
          {currentUser && (
            <p className="text-sm text-gray-500 mt-1">
              Étudiant : {currentUser.username}
            </p>
          )}
          {error && <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>}
        </div>

        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fichier PDF *
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    {formData.fichier 
                      ? <span className="font-semibold">{formData.fichier.name}</span> 
                      : <>Cliquez pour télécharger ou glissez-déposez</>}
                  </p>
                  <p className="text-xs text-gray-500">PDF uniquement (max. 5MB)</p>
                </div>
                <input 
                  type="file" 
                  name="fichier"
                  onChange={handleChange}
                  className="hidden"
                  accept=".pdf"
                  required
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/listExercices')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ReponseForm;
