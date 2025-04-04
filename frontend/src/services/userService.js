import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

// Obtenir la liste des étudiants
export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};


