import { vi } from "vitest";
import type { TaskResponse } from "../../types/task";

export const mockTasks: TaskResponse[] = [
  { id: 1, title: "Buy groceries", description: "Milk, eggs, bread", status: "PENDING" },
  { id: 2, title: "Finish report", description: "Q3 summary", status: "IN_PROGRESS" },
  { id: 3, title: "Clean house", description: "Vacuum and dust", status: "COMPLETED" },
];

export const getTasks = vi.fn();
export const createTask = vi.fn();
export const updateTask = vi.fn();
export const deleteTask = vi.fn();