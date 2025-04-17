import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function MotDePasse() {
  const [formData, setFormData] = useState({
    ancien: '',
    nouveau: '',
    confirme: ''
  });
  const [showPassword, setShowPassword] = useState({
    ancien: false,
    nouveau: false,
    confirme: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer les erreurs lors de la modification
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      number: hasNumber,
      specialChar: hasSpecialChar
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    // Validation
    const newErrors = {};
    if (!formData.ancien) newErrors.ancien = 'Ancien mot de passe requis';
    if (!formData.nouveau) {
      newErrors.nouveau = 'Nouveau mot de passe requis';
    } else {
      const validation = validatePassword(formData.nouveau);
      if (!validation.length || !validation.upperCase || !validation.lowerCase || !validation.number) {
        newErrors.nouveau = 'Le mot de passe ne respecte pas les exigences';
      }
    }
    if (formData.nouveau !== formData.confirme) {
      newErrors.confirme = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulation d'une requête API
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ ancien: '', nouveau: '', confirme: '' });
    } catch (error) {
      setErrors({ submit: 'Échec de la mise à jour. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = formData.nouveau ? validatePassword(formData.nouveau) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <FiLock className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Changer le mot de passe</h2>
          <p className="mt-2 text-sm text-gray-600">
            Pour votre sécurité, choisissez un mot de passe fort et unique
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-md">
            <div className="flex">
              <FiCheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-green-800">Mot de passe mis à jour avec succès !</p>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="space-y-6">
            {/* Ancien mot de passe */}
            <div>
              <label htmlFor="ancien" className="block text-sm font-medium text-gray-700 mb-1">
                Ancien mot de passe
              </label>
              <div className="relative">
                <input
                  id="ancien"
                  name="ancien"
                  type={showPassword.ancien ? "text" : "password"}
                  value={formData.ancien}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border ${errors.ancien ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('ancien')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword.ancien ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.ancien && <p className="mt-1 text-sm text-red-600">{errors.ancien}</p>}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="nouveau" className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="nouveau"
                  name="nouveau"
                  type={showPassword.nouveau ? "text" : "password"}
                  value={formData.nouveau}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border ${errors.nouveau ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('nouveau')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword.nouveau ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.nouveau && <p className="mt-1 text-sm text-red-600">{errors.nouveau}</p>}
              
              {/* Indicateur de force du mot de passe */}
              {formData.nouveau && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-500">Le mot de passe doit contenir :</p>
                  <ul className="text-xs space-y-1">
                    <li className={`flex items-center ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.length ? <FiCheckCircle className="mr-1" /> : <span className="w-4 h-4 mr-1 inline-block">•</span>}
                      Au moins 8 caractères
                    </li>
                    <li className={`flex items-center ${passwordValidation.upperCase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.upperCase ? <FiCheckCircle className="mr-1" /> : <span className="w-4 h-4 mr-1 inline-block">•</span>}
                      Une majuscule
                    </li>
                    <li className={`flex items-center ${passwordValidation.lowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.lowerCase ? <FiCheckCircle className="mr-1" /> : <span className="w-4 h-4 mr-1 inline-block">•</span>}
                      Une minuscule
                    </li>
                    <li className={`flex items-center ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.number ? <FiCheckCircle className="mr-1" /> : <span className="w-4 h-4 mr-1 inline-block">•</span>}
                      Un chiffre
                    </li>
                    <li className={`flex items-center ${passwordValidation.specialChar ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.specialChar ? <FiCheckCircle className="mr-1" /> : <span className="w-4 h-4 mr-1 inline-block">•</span>}
                      Un caractère spécial (optionnel)
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirme" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirme"
                  name="confirme"
                  type={showPassword.confirme ? "text" : "password"}
                  value={formData.confirme}
                  onChange={handleChange}
                  className={`block w-full px-4 py-2 border ${errors.confirme ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirme')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  {showPassword.confirme ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirme && <p className="mt-1 text-sm text-red-600">{errors.confirme}</p>}
            </div>

            {/* Bouton de soumission */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    En cours...
                  </span>
                ) : (
                  'Mettre à jour le mot de passe'
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Pour votre sécurité, nous ne stockons jamais votre mot de passe en clair.</p>
        </div>
      </div>
    </div>
  );
}

export default MotDePasse;