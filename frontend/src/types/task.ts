export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface TaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
}

export interface TaskResponse {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
}