import { Task } from '@/types/task'
import { twMerge } from 'tailwind-merge'

interface TaskItemProps {
    task: Task
    onToggle: (id: string, isComplete: boolean) => void
    onDelete: (id: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
    const priorityConfig = {
        high: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'flag' },
        medium: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: 'flag' },
        low: { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'flag' },
    }

    const config = priorityConfig[task.priority || 'medium']

    return (
        <div
            className={twMerge(
                "flex items-center gap-4 rounded-2xl p-4 shadow-sm border transition-all active:scale-[0.98] group mb-3",
                task.is_complete
                    ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/50 opacity-70"
                    : "bg-surface-light dark:bg-surface-dark border-slate-200/60 dark:border-slate-800/60 hover:border-primary/40"
            )}
        >
            <button
                onClick={() => onToggle(task.id, !task.is_complete)}
                className={twMerge(
                    "size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                    task.is_complete
                        ? "bg-primary border-primary text-white"
                        : "border-slate-300 dark:border-slate-600 hover:border-primary"
                )}
            >
                {task.is_complete && <span className="material-symbols-rounded text-base font-bold">check</span>}
            </button>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className={twMerge(
                        "text-sm font-bold truncate tracking-tight transition-all",
                        task.is_complete ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"
                    )}>
                        {task.title}
                    </h4>
                    {task.priority === 'high' && !task.is_complete && (
                        <div className="size-2 rounded-full bg-rose-500 shadow-sm animate-pulse"></div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        <span className="material-symbols-rounded text-[12px]">label</span>
                        <p className="text-[9px] font-black uppercase tracking-widest">{task.category || 'General'}</p>
                    </div>

                    <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                            <span className="material-symbols-rounded text-xl">edit</span>
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        >
                            <span className="material-symbols-rounded text-xl">delete</span>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={twMerge(
                    "w-14 h-14 bg-center bg-no-repeat bg-cover rounded-xl shrink-0 border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all group-hover:scale-105",
                    task.is_complete && "grayscale opacity-50"
                )}
                style={{ backgroundImage: `url("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&q=80&auto=format&fit=crop")` }}
            />
        </div>
    )
}
