import axios from "axios";
import { toast } from "sonner";
import { getToken, clearAuthCookies } from "../utils/cookies";
import type { ApiError } from "../types/api";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const apiError: ApiError | undefined = error.response?.data;

        if (status === 401) {
            clearAuthCookies();
            toast.error(apiError?.error ?? "Session expirée. Veuillez vous reconnecter.");
            window.location.href = "/login";
        } else if (status === 404) {
            toast.error(apiError?.error ?? "Ressource introuvable.");
        } else if (status === 409) {
            toast.error(apiError?.error ?? "Conflit détecté.");
        } else if (status >= 500) {
            toast.error(apiError?.error ?? "Erreur serveur. Veuillez réessayer.");
        } else if (!error.response) {
            toast.error("Impossible de contacter le serveur.");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;