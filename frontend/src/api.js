import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Instance Axios de base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour injecter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fonctions API
export const registerUser = (userData) => {
  return api.post("/api/auth/register/", userData);
};

export const fetchUsers = async () => {
  try {
    const response = await api.get("/api/users/");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error;
  }
};

export const getExercices = async () => {
  try {
    const response = await api.get("/api/exercises/");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des exercice:", error);
    throw error;
  }
};

export const getCorrection = async () => {
  try {
    const response = await api.get("/api/notes/");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des corrections:", error);
    throw error;
  }
};

export const createExercice = async (formData) => {
  try {
    const response = await api.post("/api/exercises/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'exercice:", error);
    throw error;
  }
};

export const createCorrection = async (formData) => {
  try {
    const response = await api.post("/api/correction/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'exercice:", error);
    throw error;
  }
};



export const getCurrentUser = async () => {
  try {
    const response = await api.get("/api/auth/me/");
    return response.data;
  } catch (error) {
    console.error("Erreur de récupération de l'utilisateur:", error);
    // Gestion spécifique du 401
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/api/auth/login/", credentials);
    return response.data;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    throw error;
  }
};

export default api;