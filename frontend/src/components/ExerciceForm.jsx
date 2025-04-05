import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { createExercice, getCurrentUser } from '../api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExerciceForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titre: '',
    fichier: null,
    professeur: ''
  })
  const [currentUser, setCurrentUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user) // Correction ici (parentheses au lieu de =)
        setFormData(prev => ({ ...prev, professeur: user.id }))
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur:", error)
        navigate('/login')
      }
    }
    loadUser()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError("Vous devez être connecté pour créer un exercice")
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('titre', formData.titre)
      formDataToSend.append('fichier', formData.fichier)
      formDataToSend.append('professeur_id', currentUser.id)

      await createExercice(formDataToSend)
      toast.success('Exercice enregistrer avec succès !', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/listExercices')
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6">
          <h1 className="text-2xl font-bold text-gray-800">Nouvel Exercice</h1>
          {currentUser && (
            <p className="text-sm text-gray-500 mt-1">
              Créé par : {currentUser.username} ({currentUser.role})
            </p>
          )}
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre de l'exercice *
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

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
              onClick={() => navigate('/exercices')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ExerciceForm