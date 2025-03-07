import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem('USER_ROLE', res.data.role); // Stocker le rôle
                
                // Redirection basée sur le rôle
                switch(res.data.role) {
                    case 'admin':
                        //navigate('/');
                        navigate('/admin-dashboard');
                        break;
                    case 'professor':
                        navigate('/professor-dashboard');
                        break;
                    case 'student':
                    default:
                        navigate('/student-dashboard');
                }
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
                 <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{name}</h1>
                
                <div className="space-y-4">
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 transition-colors"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                </div>

                <button 
                    className={`w-full mt-6 py-2 px-4 text-white font-medium rounded-md transition-colors
                        ${loading ? 'bg-gray-400 hover:bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : name}
                </button>
            </div>
        </form>
        </div>
    );
}

export default Form;
