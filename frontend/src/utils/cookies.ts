
import Cookies from "js-cookie";

const TOKEN_KEY = "task_manager_token";
const USER_KEY = "task_manager_user";

export const setAuthCookies = (token: string, fullName: string, email: string, expiresIn: number) => {
    const expiresInDays = expiresIn / 86400;
    Cookies.set(TOKEN_KEY, token, { expires: expiresInDays, sameSite: "strict" });
    Cookies.set(USER_KEY, JSON.stringify({ fullName, email }), { expires: expiresInDays, sameSite: "strict" });
};

export const getToken = (): string | undefined => Cookies.get(TOKEN_KEY);

export const getStoredUser = (): { fullName: string; email: string } | null => {
    const raw = Cookies.get(USER_KEY);
    return raw ? JSON.parse(raw) : null;
};

export const clearAuthCookies = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
};