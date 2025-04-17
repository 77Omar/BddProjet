import React, { useState, useEffect } from 'react';
import { FiUpload, FiFileText, FiCalendar, FiBook, FiUser, FiMail, FiCheckCircle } from 'react-icons/fi';

function Soumettre() {
  // États pour les données
  const [devoirs, setDevoirs] = useState([]);
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    fichier: null,
    commentaires: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [filter, setFilter] = useState({ matiere: 'all', semestre: 'all' });

  // Charger les devoirs disponibles (simulation)
  useEffect(() => {
    // En réalité, vous feriez un appel API ici
    const fakeDevoirs = [
      {
        id: 1,
        titre: "Projet Réseaux",
        matiere: "Informatique",
        semestre: "S1",
        dateLimite: "2023-06-15",
        description: "Implémentation d'un protocole réseau"
      },
      {
        id: 2,
        titre: "Analyse Chimique",
        matiere: "Chimie",
        semestre: "S2",
        dateLimite: "2023-06-20",
        description: "Rapport d'analyse spectrale"
      },
      {
        id: 3,
        titre: "Mécanique Quantique",
        matiere: "Physique",
        semestre: "S1",
        dateLimite: "2023-06-25",
        description: "Problèmes de mécanique quantique"
      }
    ];
    setDevoirs(fakeDevoirs);
  }, []);

  // Filtrer les devoirs
  const filteredDevoirs = devoirs.filter(devoir => {
    return (filter.matiere === 'all' || devoir.matiere === filter.matiere) &&
           (filter.semestre === 'all' || devoir.semestre === filter.semestre);
  });

  // Gérer la sélection d'un devoir
  const handleSelectDevoir = (devoir) => {
    setSelectedDevoir(devoir);
    setIsSubmitted(false);
  };

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer le fichier uploadé
  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, fichier: e.target.files[0] }));
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous feriez un appel API pour soumettre le devoir
    console.log({
      devoir: selectedDevoir,
      etudiant: formData
    });
    setIsSubmitted(true);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calculer les jours restants
  const getDaysRemaining = (dateLimite) => {
    const today = new Date();
    const deadline = new Date(dateLimite);
    const diffTime = deadline - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Soumission des devoirs
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Sélectionnez un devoir et soumettez votre travail
          </p>
        </div>

        {!selectedDevoir ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Devoirs disponibles</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Filtrer par matière</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={filter.matiere}
                    onChange={(e) => setFilter({...filter, matiere: e.target.value})}
                  >
                    <option value="all">Toutes les matières</option>
                    <option value="Informatique">Informatique</option>
                    <option value="Physique">Physique</option>
                    <option value="Chimie">Chimie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Filtrer par semestre</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={filter.semestre}
                    onChange={(e) => setFilter({...filter, semestre: e.target.value})}
                  >
                    <option value="all">Tous les semestres</option>
                    <option value="S1">Semestre 1</option>
                    <option value="S2">Semestre 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              {filteredDevoirs.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun devoir disponible</h3>
                  <p className="mt-1 text-sm text-gray-500">Essayez de modifier vos critères de filtrage.</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredDevoirs.map((devoir) => (
                    <li key={devoir.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-blue-600 truncate">{devoir.titre}</p>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {devoir.matiere}
                              </span>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {devoir.semestre}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{devoir.description}</p>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <p>
                                À rendre avant le {formatDate(devoir.dateLimite)} • 
                                <span className={getDaysRemaining(devoir.dateLimite) <= 3 ? "text-red-500 font-medium" : "text-gray-600"}>
                                  {getDaysRemaining(devoir.dateLimite)} jours restants
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectDevoir(devoir)}
                          className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Sélectionner
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : isSubmitted ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 text-center">
              <FiCheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-medium text-gray-900">Devoir soumis avec succès !</h2>
              <p className="mt-2 text-gray-600">
                Votre fichier pour le devoir "{selectedDevoir.titre}" a bien été enregistré.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedDevoir(null);
                    setIsSubmitted(false);
                    setFormData({
                      nom: '',
                      email: '',
                      fichier: null,
                      commentaires: ''
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Soumettre un autre devoir
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Soumettre votre devoir</h2>
                <button
                  onClick={() => setSelectedDevoir(null)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Retour à la liste
                </button>
              </div>
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <h3 className="text-md font-medium text-blue-800">{selectedDevoir.titre}</h3>
                <div className="mt-2 flex items-center text-sm text-blue-700">
                  <FiCalendar className="flex-shrink-0 mr-1.5 h-4 w-4" />
                  <p>
                    À rendre avant le {formatDate(selectedDevoir.dateLimite)} • 
                    <span className="font-medium">
                      {getDaysRemaining(selectedDevoir.dateLimite)} jours restants
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="nom"
                      id="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Fichier du devoir (PDF uniquement)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Uploader un fichier</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">ou glisser-déposer</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF jusqu'à 10MB
                      </p>
                      {formData.fichier && (
                        <div className="flex items-center justify-center text-sm text-gray-500">
                          <FiFileText className="mr-2 h-4 w-4" />
                          <span>{formData.fichier.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="commentaires" className="block text-sm font-medium text-gray-700">
                    Commentaires (optionnel)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="commentaires"
                      name="commentaires"
                      rows={3}
                      value={formData.commentaires}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedDevoir(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiUpload className="-ml-1 mr-2 h-5 w-5" />
                  Soumettre le devoir
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Soumettre;