
import type { TaskResponse } from "../types/task";

interface Props {
  task: TaskResponse;
  onEdit: (task: TaskResponse) => void;
  onDelete: (id: number) => void;
}

const statusStyles: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-amber-100 text-amber-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<string, string> = {
    PENDING: "À faire",
    IN_PROGRESS: "En cours",
    COMPLETED   : "Terminée",
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-start gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-slate-900 truncate">{task.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyles[task.status]}`}>
                        {statusLabels[task.status]}
                    </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
            </div>

            <div className="flex gap-2 shrink-0">
                <button
                    onClick={() => onEdit(task)}
                    className="text-sm text-slate-600 hover:text-slate-900 px-2 py-1"
                >
                    Modifier
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="text-sm text-red-600 hover:text-red-800 px-2 py-1"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
}