import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, allowedRoles }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth().finally(() => setIsLoading(false));
    }, []);

    const refreshToken = async () => {
        try {
            const res = await api.post("/api/token/refresh/", { 
                refresh: localStorage.getItem(REFRESH_TOKEN) 
            });
            
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                const decoded = jwtDecode(res.data.access);
                localStorage.setItem('USER_ROLE', decoded.role);
                return true;
            }
        } catch (error) {
            console.error("Refresh token failed:", error);
            return false;
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                const refreshed = await refreshToken();
                setIsAuthorized(refreshed);
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("Token decoding failed:", error);
            setIsAuthorized(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    const userRole = localStorage.getItem("USER_ROLE");
    
    // Si non autorisé, redirige vers login
    if (!isAuthorized) {
        return <Navigate to="/login" replace />;
    }

    // Si le rôle n'est pas dans les rôles autorisés, redirige vers unauthorized
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;