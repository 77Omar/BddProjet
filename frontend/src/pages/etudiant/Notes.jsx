import React from 'react';
import { FiAward, FiBook, FiTrendingUp } from 'react-icons/fi';

const Notes = () => {
  // Données des notes
  const notes = [
    { 
      id: 1,
      matiere: 'Mathématiques', 
      note: 18,
      appreciation: 'Très bien',
      commentaire: 'Excellent travail, continuez ainsi !'
    },
    { 
      id: 2,
      matiere: 'Machine Learning', 
      note: 15,
      appreciation: 'Bien',
      commentaire: 'Bonne maîtrise des concepts de base'
    },
    { 
      id: 3,
      matiere: 'Base de Données', 
      note: 17,
      appreciation: 'Tres bien',
      commentaire: 'Quelques erreurs de conception à revoir'
    },
    { 
      id: 4,
      matiere: 'Physique', 
      note: 12,
      appreciation: 'Assez bien',
      commentaire: 'Besoin de revoir les bases' 
     
    },
  ];

  // Couleurs selon l'appréciation
  const getAppreciationColor = (appreciation) => {
    switch(appreciation) {
      case 'Très bien': return 'bg-purple-100 text-purple-800';
      case 'Bien': return 'bg-green-100 text-green-800';
      case 'Assez bien': return 'bg-blue-100 text-blue-800';
      case 'À améliorer': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Couleurs selon la note
  const getNoteColor = (note) => {
    if (note >= 16) return 'text-purple-600 font-bold';
    if (note >= 14) return 'text-green-600 font-bold';
    if (note >= 12) return 'text-blue-600 font-bold';
    if (note >= 10) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  // Calcul de la moyenne
  const moyenne = notes.reduce((acc, curr) => acc + curr.note, 0) / notes.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mes Notes</h1>
            <p className="text-gray-600">Résultats par matière</p>
          </div>
          
          {/* Widget Moyenne */}
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <FiTrendingUp className="text-blue-600 text-xl md:text-2xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Moyenne générale</p>
              <p className={`text-xl md:text-2xl font-bold ${getNoteColor(moyenne)}`}>
                {moyenne.toFixed(1)}/20
              </p>
            </div>
          </div>
        </div>

        {/* Tableau des notes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* En-tête du tableau */}
          <div className="grid grid-cols-12 bg-blue-600 text-white p-4 font-medium">
            <div className="col-span-6 md:col-span-5 flex items-center">
              <FiBook className="mr-2" />
              <span>Matière</span>
            </div>
            <div className="col-span-3 md:col-span-2 text-center">Note</div>
            <div className="hidden md:flex col-span-3 justify-center">Appréciation</div>
            <div className="col-span-3 md:col-span-2 text-center">Détails</div>
          </div>

          {/* Corps du tableau */}
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-6 md:col-span-5 font-medium text-gray-800">
                {note.matiere}
              </div>
              <div className={`col-span-3 md:col-span-2 text-center ${getNoteColor(note.note)}`}>
                {note.note}/20
              </div>
              <div className="hidden md:flex col-span-3 justify-center">
                <span className={`px-3 py-1 rounded-full text-sm ${getAppreciationColor(note.appreciation)}`}>
                  {note.appreciation}
                </span>
              </div>
              <div className="col-span-3 md:col-span-2 flex justify-center">
                <button 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title={note.commentaire}
                >
                  <FiAward className="text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Légende responsive */}
        <div className="mt-6 grid grid-cols-2 md:flex md:flex-wrap gap-3">
          {[
            { text: '16-20: Très bien', color: 'bg-purple-500' },
            { text: '14-15.9: Bien', color: 'bg-green-500' },
            { text: '12-13.9: Assez bien', color: 'bg-blue-500' },
            { text: '10-11.9: Passable', color: 'bg-yellow-500' },
            { text: '0-9.9: À améliorer', color: 'bg-red-500' },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
              <span className="text-sm text-gray-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notes;