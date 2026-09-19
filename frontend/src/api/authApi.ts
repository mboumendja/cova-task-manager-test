import axiosClient from "./axiosClient";
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from "../types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>("/auth/login", data);
    return response.data;
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await axiosClient.post<RegisterResponse>("/auth/register", data);
    return response.data;
};