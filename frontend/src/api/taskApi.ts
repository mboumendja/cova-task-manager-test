import axiosClient from "./axiosClient";
import type { TaskRequest, TaskResponse } from "../types/task";

export const getTasks = async (): Promise<TaskResponse[]> => {
    const response = await axiosClient.get<TaskResponse[]>("/tasks");
    return response.data;
};

export const createTask = async (data: TaskRequest): Promise<TaskResponse> => {
    const response = await axiosClient.post<TaskResponse>("/tasks", data);
    return response.data;
};

export const updateTask = async (id: number, data: TaskRequest): Promise<TaskResponse> => {
    const response = await axiosClient.patch<TaskResponse>(`/tasks/${id}`, data);
    return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
    await axiosClient.delete(`/tasks/${id}`);
};