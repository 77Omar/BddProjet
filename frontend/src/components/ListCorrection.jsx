import React, { useState, useEffect } from 'react';
import { getCorrectionAuto,validat } from "../api";
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import api from '../api';

const CorrectionList = ({ corrections, onSelect, onValidate }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exercice
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              État
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {corrections.map((correction) => (
            <tr key={correction.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  Exercice #{correction.exercice}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(correction.date_creation).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {correction.etat ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Validé
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    En attente
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onSelect(correction)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <EyeIcon className="h-5 w-5 inline" /> Voir
                </button>
                {!correction.etat && onValidate && (
                  <button
                    onClick={() => onValidate(correction.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <CheckCircleIcon className="h-5 w-5 inline" /> Valider
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {corrections.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucune correction trouvée
        </div>
      )}
    </div>
  );
};

const ListCorrection = () => {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorrections = async () => {
      try {
        const response = await getCorrectionAuto();
        setCorrections(response);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCorrections();
  }, []);

  const validateCorrection = async (id) => {
    try {
      
       await validat(id, {
              etat: true
            });
            
      setCorrections(corrections.map(c => 
        c.id === id ? { ...c, etat: true } : c
      ));
    } catch (error) {
      console.error("Erreur de validation:", error);
    }
  };

  // Filtrer les corrections selon l'onglet
  const pendingCorrections = corrections.filter(c => !c.etat);
  const validatedCorrections = corrections.filter(c => c.etat);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
        <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (

    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Corrections Automatiques
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <Tabs>
            <TabList className="flex border-b">
              <Tab className="px-4 py-2 font-medium focus:outline-none ui-selected:border-b-2 ui-selected:border-indigo-500 ui-selected:text-indigo-600">
                Toutes les Corrections ({corrections.length})
              </Tab>
              <Tab className="px-4 py-2 font-medium focus:outline-none ui-selected:border-b-2 ui-selected:border-indigo-500 ui-selected:text-indigo-600">
                À Valider ({pendingCorrections.length})
              </Tab>
              <Tab className="px-4 py-2 font-medium focus:outline-none ui-selected:border-b-2 ui-selected:border-indigo-500 ui-selected:text-indigo-600">
                Validées ({validatedCorrections.length})
              </Tab>
            </TabList>

            <TabPanel>
              <CorrectionList 
                corrections={corrections}
                onSelect={setSelectedCorrection}
                onValidate={validateCorrection}
              />
            </TabPanel>
            <TabPanel>
              <CorrectionList 
                corrections={pendingCorrections}
                onSelect={setSelectedCorrection}
                onValidate={validateCorrection}
              />
            </TabPanel>
            <TabPanel>
              <CorrectionList 
                corrections={validatedCorrections}
                onSelect={setSelectedCorrection}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>

      {selectedCorrection && (
        <CorrectionDetailModal 
          correction={selectedCorrection}
          onClose={() => setSelectedCorrection(null)}
          onValidate={() => {
            validateCorrection(selectedCorrection.id);
            setSelectedCorrection(null);
          }}
        />
      )}
    </div>
    </Layout>
  );
};

const CorrectionDetailModal = ({ correction, onClose, onValidate }) => {
  // Fonction de formatage améliorée pour le responsive
  const formatSQL = (sql) => {
    if (!sql) return sql;

    // Nettoyage initial
    let formatted = sql
      .replace(/\s+/g, ' ') // Réduit les espaces multiples
      .trim();

    // Formatage conditionnel basé sur la largeur d'écran
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Version mobile compacte
      formatted = formatted
        .replace(/(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|VALUES|SET)/gi, '\n$1')
        .replace(/;/g, ';\n')
        .replace(/,/g, ',\n ');
    } else {
      // Version desktop avec indentation
      formatted = formatted
        .replace(/(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|INSERT INTO|UPDATE|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|VALUES|SET)/gi, '\n$1')
        .replace(/;/g, ';\n')
        .replace(/,/g, ',\n  ')
        .replace(/(ON|AND|OR)\s+/gi, '\n  $1 ');
    }

    return formatted;
  };

  // State pour le réformatage lors du redimensionnement
  const [formattedSQL, setFormattedSQL] = useState(formatSQL(correction.correction));
  
  useEffect(() => {
    const handleResize = () => {
      setFormattedSQL(formatSQL(correction.correction));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [correction.correction]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] md:max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Correction Devoir : {correction.exercice}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            aria-label="Fermer"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
         
          
          <div>
            <h3 className="text-md md:text-lg font-medium text-gray-900 mb-2">Correction Automatique</h3>
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg overflow-x-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs md:text-sm leading-5 md:leading-6 text-gray-800">
                {formattedSQL}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          {!correction.etat && (
            <button
              onClick={onValidate}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
              Valider cette correction
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
export default ListCorrection;