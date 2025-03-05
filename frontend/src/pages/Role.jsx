import React, { useState, useEffect } from "react";
import api from "../api"; 

function Role() {
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Récupérer les rôles dès le chargement du composant
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = () => {
    api
      .get("/api/roles/")
      .then((res) => {
        setRoles(res.data);
        console.log("Rôles récupérés :", res.data);
      })
      .catch((err) => {
        alert("Erreur lors de la récupération des rôles : " + err);
      });
  };

  const handleCreateRole = (e) => {
    e.preventDefault();
    api
      .post("/api/roles/", { name, description, users: [1] })
      .then((res) => {
        if (res.status === 201) {
          alert("Rôle créé !");
          // Réinitialiser le formulaire
          setName("");
          setDescription("");
          fetchRoles();
        } else {
          alert("Échec de la création du rôle.");
        }
      })
      .catch((err) => alert("Erreur lors de la création du rôle : " + err));
  };

  const handleDeleteRole = (id) => {
    api
      .delete(`/api/roles/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Rôle supprimé !");
          fetchRoles();
        } else {
          alert("Échec de la suppression du rôle.");
        }
      })
      .catch((err) => alert("Erreur lors de la suppression du rôle : " + err));
  };

  return (
    <div className="container mx-auto p-4">
  
      
      <h2 className="text-2xl font-bold mb-4">Gestion des Rôles</h2>

      {/* Liste des rôles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{role.name}</h3>
            <p className="text-gray-700 mb-2">{role.description}</p>
            <p className="text-sm text-gray-500">
              Créé le {new Date(role.created_at).toLocaleDateString("fr-FR")}
            </p>
            <button
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              onClick={() => handleDeleteRole(role.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Formulaire de création de rôle */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Créer un nouveau rôle</h2>
      <form onSubmit={handleCreateRole} className="space-y-4">
        <div>
          <label htmlFor="roleName" className="block text-gray-700">
            Nom :
          </label>
          <input
            type="text"
            id="roleName"
            name="roleName"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="roleDescription" className="block text-gray-700">
            Description :
          </label>
          <textarea
            id="roleDescription"
            name="roleDescription"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Créer le rôle
        </button>
      </form>
    </div>
  );
}

export default Role;
