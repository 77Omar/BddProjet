import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api"; // 🔥 Import de la nouvelle fonction

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await registerUser({ username, password, role }); // 🔥 Utilisation de registerUser()
      navigate("/login"); // Rediriger vers la page de connexion
    } catch (error) {
      setError("Erreur lors de l'inscription. Vérifiez vos informations.");
      console.error("Erreur:", error.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-900">Inscription</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle</label>
            <select
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">-- Sélectionner un rôle --</option>
              <option value="prof">Professeur</option>
              <option value="etudiant">Étudiant</option>
            </select>
          </div>
          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
            S'inscrire
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">vous avez un compte ? <a href="/login" className="text-green-700">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
