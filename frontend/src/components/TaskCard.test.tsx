// src/components/TaskCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard";
import type { TaskResponse } from "../types/task";

const task: TaskResponse = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    status: "PENDING",
};

describe("TaskCard", () => {
    it("renders task title, description, and status", () => {
        render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Test Task")).toBeDefined();
        expect(screen.getByText("Test Description")).toBeDefined();
        expect(screen.getByText("À faire")).toBeDefined();
    });

    it("calls onEdit with the task when 'Modifier' is clicked", () => {
        const onEdit = vi.fn();
        render(<TaskCard task={task} onEdit={onEdit} onDelete={vi.fn()} />);

        fireEvent.click(screen.getByText("Modifier"));

        expect(onEdit).toHaveBeenCalledWith(task);
    });

    it("calls onDelete with the task id when 'Supprimer' is clicked", () => {
        const onDelete = vi.fn();
        render(<TaskCard task={task} onEdit={vi.fn()} onDelete={onDelete} />);

        fireEvent.click(screen.getByText("Supprimer"));

        expect(onDelete).toHaveBeenCalledWith(1);
    });

    it("shows the correct status badge color class for COMPLETED", () => {
        const completedTask: TaskResponse = { ...task, status: "COMPLETED" };
        render(<TaskCard task={completedTask} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getByText("Terminée")).toBeDefined();
    });
});