import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface TaskInputProps {
    onAddTask: (title: string, priority: 'low' | 'medium' | 'high', category: string, description?: string) => Promise<void>
    onCancel: () => void
}

export function TaskInput({ onAddTask, onCancel }: TaskInputProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [category, setCategory] = useState('Work')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim()) return
        setIsLoading(true)
        await onAddTask(title, priority, category, description)
        setIsLoading(false)
    }

    const categories = [
        { name: 'Work', icon: 'work' },
        { name: 'Personal', icon: 'home' },
        { name: 'Health', icon: 'favorite' },
        { name: 'Shopping', icon: 'shopping_bag' },
    ]

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark overflow-y-auto no-scrollbar">
            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shrink-0">
                <div className="flex items-center justify-between px-4 h-16">
                    <button onClick={onCancel} className="text-primary text-base font-medium">Cancel</button>
                    <h1 className="text-lg font-semibold tracking-tight">Create New Task</h1>
                    <div className="w-12"></div>
                </div>
            </header>

            <main className="flex-1 flex flex-col pb-32">
                {/* Task Title Section */}
                <div className="px-4 py-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Task Title</p>
                        <input
                            className="w-full bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] rounded-xl h-14 px-4 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white"
                            placeholder="E.g. Design Sprint Meeting"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Description Section */}
                <div className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">Description</p>
                        <textarea
                            className="w-full bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] rounded-xl p-4 min-h-[120px] text-base focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-white resize-none"
                            placeholder="Add details about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mt-4 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mb-3">Schedule & Details</h3>
                    <div className="bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        <div className="flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-rounded">calendar_today</span>
                                </div>
                                <span className="font-medium">Date</span>
                            </div>
                            <span className="text-primary font-medium">Oct 24, 2023</span>
                        </div>
                        <div className="flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-800/50 cursor-pointer transition-colors">
                            <div className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-rounded">schedule</span>
                                </div>
                                <span className="font-medium">Time</span>
                            </div>
                            <span className="text-primary font-medium">10:00 AM</span>
                        </div>
                    </div>
                </div>

                {/* Category Selector */}
                <div className="mt-8 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mb-3">Category</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => setCategory(cat.name)}
                                className={twMerge(
                                    "flex items-center gap-2 flex-none px-5 py-2.5 rounded-full font-medium text-sm transition-all",
                                    category === cat.name
                                        ? "bg-primary text-white"
                                        : "bg-white dark:bg-[#1c1f27] border border-gray-200 dark:border-[#3b4354] text-gray-700 dark:text-gray-300"
                                )}
                            >
                                <span className="material-symbols-rounded text-lg">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Selector */}
                <div className="mt-8 px-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1 mb-3">Priority Level</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { id: 'low', label: 'Low', color: 'bg-green-500' },
                            { id: 'medium', label: 'Medium', color: 'bg-yellow-500' },
                            { id: 'high', label: 'High', color: 'bg-red-500' },
                        ].map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPriority(p.id as any)}
                                className={twMerge(
                                    "flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all border-2",
                                    priority === p.id
                                        ? "bg-primary/10 border-primary"
                                        : "bg-white dark:bg-[#1c1f27] border-gray-200 dark:border-[#3b4354] hover:border-primary/50"
                                )}
                            >
                                <div className={twMerge("w-2 h-2 rounded-full mb-2", p.color)}></div>
                                <span className={twMerge("text-xs font-semibold", priority === p.id ? "text-primary" : "text-gray-600 dark:text-gray-400")}>
                                    {p.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Action Button */}
            <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-6 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light dark:via-background-dark to-transparent">
                <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center"
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </button>
                <div className="h-4"></div>
            </div>
        </div>
    )
}
