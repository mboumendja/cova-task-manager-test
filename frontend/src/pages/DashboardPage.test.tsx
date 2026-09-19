// src/pages/DashboardPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "./DashboardPage";
import * as taskApi from "../api/taskApi";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("../api/taskApi");

const mockTasks = [
    { id: 1, title: "Buy groceries", description: "Milk and eggs", status: "PENDING" as const },
    { id: 2, title: "Finish report", description: "Q3 summary", status: "IN_PROGRESS" as const },
    { id: 3, title: "Clean house", description: "Vacuum", status: "COMPLETED" as const },
];

function renderDashboard() {
    return render(
        <BrowserRouter>
        <AuthProvider>
            <DashboardPage />
        </AuthProvider>
        </BrowserRouter>
    );
}

describe("DashboardPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(taskApi.getTasks).mockResolvedValue(mockTasks);
    });

    it("fetches and displays all tasks on mount", async () => {
        renderDashboard();

        await waitFor(() => {
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
        expect(screen.getByText("Finish report")).toBeInTheDocument();
        expect(screen.getByText("Clean house")).toBeInTheDocument();
        });
    });

    it("filters tasks by search input", async () => {
        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText("Rechercher une tâche..."), {
        target: { value: "report" },
        });

        expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
        expect(screen.getByText("Finish report")).toBeInTheDocument();
    });

    it("filters tasks by status", async () => {
        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.change(screen.getByDisplayValue("Tous les statuts"), {
        target: { value: "COMPLETED" },
        });

        expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
        expect(screen.getByText("Clean house")).toBeInTheDocument();
    });

    it("creates a new task and adds it to the list", async () => {
        const newTask = { id: 4, title: "New Task", description: "New Desc", status: "PENDING" as const };
        vi.mocked(taskApi.createTask).mockResolvedValue(newTask);

        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.click(screen.getByText("+ Nouvelle tâche"));
        fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "New Task" } });
        fireEvent.change(screen.getByLabelText("Description"), { target: { value: "New Desc" } });
        fireEvent.click(screen.getByText("Créer"));

        await waitFor(() => {
            expect(taskApi.createTask).toHaveBeenCalledWith({
                title: "New Task",
                description: "New Desc",
                status: "PENDING",
            });
            expect(screen.getByText("New Task")).toBeInTheDocument();
        });
    });

    it("updates an existing task", async () => {
        const updatedTask = { ...mockTasks[0], title: "Updated groceries" };
        vi.mocked(taskApi.updateTask).mockResolvedValue(updatedTask);

        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.click(screen.getAllByText("Modifier")[0]);
        fireEvent.change(screen.getByLabelText("Titre"), { target: { value: "Updated groceries" } });
        fireEvent.click(screen.getByText("Enregistrer"));

        await waitFor(() => {
            expect(taskApi.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: "Updated groceries" }));
            expect(screen.getByText("Updated groceries")).toBeInTheDocument();
        });
    });

    it("deletes a task after confirmation", async () => {
        vi.mocked(taskApi.deleteTask).mockResolvedValue(undefined);
        vi.spyOn(window, "confirm").mockReturnValue(true);

        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.click(screen.getAllByText("Supprimer")[0]);

        await waitFor(() => {
            expect(taskApi.deleteTask).toHaveBeenCalledWith(1);
            expect(screen.queryByText("Buy groceries")).not.toBeInTheDocument();
        });
    });

    it("does not delete a task if confirmation is cancelled", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);

        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.click(screen.getAllByText("Supprimer")[0]);

        expect(taskApi.deleteTask).not.toHaveBeenCalled();
        expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    });

    it("shows empty state when no tasks match the filter", async () => {
        renderDashboard();
        await waitFor(() => expect(screen.getByText("Buy groceries")).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText("Rechercher une tâche..."), {
            target: { value: "nonexistent task xyz" },
        });

        expect(screen.getByText("Aucune tâche trouvée.")).toBeInTheDocument();
    });
});