
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    fullName: string;
    email: string;
    accessToken: string;
    expiresIn: number;
}

export interface RegisterResponse {
    message: string;
}