import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";

function ProtectedRoute({ children, requiredRole }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    
    const refreshToken = async () => {
        try {
            const res = await api.post("/api/token/refresh/", {

                refresh: localStorage.getItem(REFRESH_TOKEN) 
            });
            
            if (res.status === 200) {
                const userData = jwtDecode(res.data.access); // Décodez le nouveau token
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem('USER_ROLE', userData.role); // Mettez à jour le rôle
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    const userRole = localStorage.getItem("USER_ROLE");
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
