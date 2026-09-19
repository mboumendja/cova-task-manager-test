
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import * as taskApi from "../api/taskApi";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";
import TaskFormModal from "../components/TaskFormModal";
import type { TaskResponse, TaskRequest } from "../types/task";

export default function DashboardPage() {
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<TaskResponse | null>(null);
    const { user, logout } = useAuth();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskApi.getTasks();
            setTasks(data);
        } catch {
            // handled globally
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTasks();
    }, []);

    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
        const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
        });
    }, [tasks, search, statusFilter]);

    const handleCreate = async (data: TaskRequest) => {
        try {
            const newTask = await taskApi.createTask(data);
            setTasks((prev) => [...prev, newTask]);
            toast.success("Tâche créée avec succès.");
        } catch {
            // handled globally
        }
    };

    const handleUpdate = async (data: TaskRequest) => {
        if (!editingTask) return;
        try {
            const updated = await taskApi.updateTask(editingTask.id, data);
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            toast.success("Tâche mise à jour.");
        } catch {
            // handled globally
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer cette tâche ?")) return;
        try {
            await taskApi.deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            toast.success("Tâche supprimée.");
        } catch {
            // handled globally
        }
    };

    const openEditModal = (task: TaskResponse) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-semibold text-slate-900">Mes tâches</h1>
                        <p className="text-sm text-slate-500">{user?.fullName}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        Déconnexion
                    </button>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        id="search"
                        name="search"
                        placeholder="Rechercher une tâche..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                        <option value="ALL">Tous les statuts</option>
                        <option value="PENDING">À faire</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="COMPLETED">Terminée</option>
                    </select>
                    <button
                        onClick={openCreateModal}
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition whitespace-nowrap"
                    >
                        + Nouvelle tâche
                    </button>
                </div>

                {loading ? 
                    (
                        <p className="text-slate-500 text-center py-8">Chargement...</p>
                    ) : filteredTasks.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">Aucune tâche trouvée.</p>
                    ) : (
                        <div className="space-y-3">
                            {filteredTasks.map((task) => (
                                <TaskCard key={task.id} task={task} onEdit={openEditModal} onDelete={handleDelete} />
                            ))}
                        </div>
                )}
            </main>

            <TaskFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={editingTask ? handleUpdate : handleCreate}
                initialData={editingTask}
            />
        </div>
    );
}