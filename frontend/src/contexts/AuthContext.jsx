import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (authToken) => {
        try {
            // Configura o cabeçalho manualmente para a primeira requisição imediata
            const response = await api.get("/user/me", {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error("Erro ao carregar perfil do usuário:", error);
            logout();
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            fetchUserProfile(storedToken);
        }

        setLoading(false);
    }, []);

    const login = async (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        await fetchUserProfile(newToken);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Erro ao fazer logout no servidor:", error);
        } finally {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                setUser,
                login,
                logout,
                isAuthenticated: !!token,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}