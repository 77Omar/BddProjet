import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/etudiants/";

// Obtenir la liste des étudiants
export const getEtudiant = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Ajouter un étudiant
export const addEtudiant = async (dataEtudiant) => {
    const response = await axios.post(API_URL, dataEtudiant);
    return response.data;
};
