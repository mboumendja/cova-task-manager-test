import { createContext, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";
import * as authApi from "../api/authApi";
import { setAuthCookies, getToken, getStoredUser, clearAuthCookies } from "../utils/cookies";
import type { LoginRequest, RegisterRequest } from "../types/auth";

interface AuthUser {
    fullName: string;
    email: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(getStoredUser());

    const login = async (data: LoginRequest) => {
        const response = await authApi.login(data);
        setAuthCookies(response.accessToken, response.fullName, response.email, response.expiresIn);
        setUser({ fullName: response.fullName, email: response.email });
        toast.success(`Bienvenue, ${response.fullName} !`);
    };

    const register = async (data: RegisterRequest) => {
        const response = await authApi.register(data);
        toast.success(response.message);
    };

    const logout = () => {
        clearAuthCookies();
        setUser(null);
        toast.info("Déconnexion réussie.");
    };

    return (
        <AuthContext.Provider
        value={{ user, isAuthenticated: !!getToken(), login, register, logout }}
        >
        {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}