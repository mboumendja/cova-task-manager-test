// src/components/TaskFormModal.test.tsx
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskFormModal from "./TaskFormModal";
import type { TaskResponse } from "../types/task";

describe("TaskFormModal", () => {
    it("does not render when isOpen is false", () => {
        render(<TaskFormModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />);
        expect(screen.queryByText("Nouvelle tâche")).not.toBeInTheDocument();
    });

    it("renders empty fields in create mode", () => {
        render(<TaskFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

        expect(screen.getByText("Nouvelle tâche")).toBeInTheDocument();
        expect(screen.getByLabelText("Titre")).toHaveValue("");
        expect(screen.getByLabelText("Description")).toHaveValue("");
    });

    it("pre-fills fields when editing an existing task", () => {
        const existingTask: TaskResponse = {
            id: 1,
            title: "Existing Task",
            description: "Existing Description",
            status: "IN_PROGRESS",
        };

        render(
            <TaskFormModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} initialData={existingTask} />
        );

        expect(screen.getByText("Modifier la tâche")).toBeInTheDocument();
        expect(screen.getByLabelText("Titre")).toHaveValue("Existing Task");
        expect(screen.getByLabelText("Description")).toHaveValue("Existing Description");
    });

    it("calls onSubmit with form data and then onClose", async () => {
        const onSubmit = vi.fn().mockResolvedValue(undefined);
        const onClose = vi.fn();

        render(<TaskFormModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);

        fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "New Task" } });
        fireEvent.change(screen.getByLabelText("Description"), { target: { value: "New Description" } });
        fireEvent.click(screen.getByText("Créer"));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                title: "New Task",
                description: "New Description",
                status: "PENDING",
            });
        });

        expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose without submitting when 'Annuler' is clicked", () => {
        const onSubmit = vi.fn();
        const onClose = vi.fn();

        render(<TaskFormModal isOpen={true} onClose={onClose} onSubmit={onSubmit} />);
        fireEvent.click(screen.getByText("Annuler"));

        expect(onClose).toHaveBeenCalled();
        expect(onSubmit).not.toHaveBeenCalled();
    });
});