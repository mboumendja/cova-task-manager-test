import { useState, useEffect, type FormEvent } from "react";
import type { TaskRequest, TaskResponse, TaskStatus } from "../types/task";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TaskRequest) => Promise<void>;
    initialData?: TaskResponse | null;
}

export default function TaskFormModal({ isOpen, onClose, onSubmit, initialData }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("PENDING");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(initialData.title);
            setDescription(initialData.description);
            setStatus(initialData.status);
        } else {
            setTitle("");
            setDescription("");
            setStatus("PENDING");
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ title, description, status });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    {initialData ? "Modifier la tâche" : "Nouvelle tâche"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                        <input
                            type="text"
                            id="task-title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            required
                            id="task-description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div>
                        <label htmlFor="task-status" className="block text-sm font-medium text-slate-700 mb-1">Statut</label>
                        <select
                            id="task-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                            <option value="PENDING">À faire</option>
                            <option value="IN_PROGRESS">En cours</option>
                            <option value="COMPLETED">Terminée</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-slate-300 text-slate-700 py-2 rounded-lg hover:bg-slate-50 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
                        >
                            {loading ? "..." : initialData ? "Enregistrer" : "Créer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}