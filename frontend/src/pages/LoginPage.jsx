import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Layout from "../components/Layout"
import {getCurrentUser } from "../api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("role",response.data.role);
      const role = response.data.role;


      if(role==("admin")){
        navigate("/dashboardAdmin"); 
      }else if(role=='prof'){
        navigate("/dashboardProf");
      }else if(role=="etudiant"){
        navigate("/dashboardEtu"); 
      }
      
    } catch (error) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    }finally{
      setLoading(false);
    }
  };

  return (
   
     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-gray-900">Connexion</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         {/*  <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700">
            Se connecter
          </button> */}
          <button 
                    className={`w-full mt-6 py-2 px-4 text-white font-medium rounded-md transition-colors
                        ${loading ? 'bg-gray-400 hover:bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Se connecter'}
                </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          pas de  compte ? <a href="/register" className="text-green-700">creer un compte</a>
        </p>
      </div>
    </div>
  
  );
};

export default LoginPage;