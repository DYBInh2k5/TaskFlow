'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Task } from '@/types/task'
import { Dashboard } from './Dashboard'
import { TaskCalendar } from './TaskCalendar'
import { TaskStats } from './TaskStats'
import { TaskInput } from './TaskInput'
import { TaskItem } from './TaskItem'
import { Settings } from './Settings'
import { Auth } from './Auth'
import { twMerge } from 'tailwind-merge'

export function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [filter, setFilter] = useState('All')
    const [catFilter, setCatFilter] = useState('All Apps')
    const [search, setSearch] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [quickTitle, setQuickTitle] = useState('')
    const [session, setSession] = useState<any>(null)
    const [currentDate, setCurrentDate] = useState(new Date())

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setTasks(data || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) fetchTasks()
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) fetchTasks()
        })

        const timer = setInterval(() => setCurrentDate(new Date()), 60000)
        return () => {
            subscription.unsubscribe()
            clearInterval(timer)
        }
    }, [])

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
    }

    const getWeekRange = () => {
        const now = new Date()
        const first = now.getDate() - now.getDay()
        const last = first + 6
        const firstDay = new Date(now.setDate(first))
        const lastDay = new Date(now.setDate(last))
        return `${formatDate(firstDay).toUpperCase()} - ${formatDate(lastDay).toUpperCase()}`
    }

    const addTask = async (title: string, priority: 'low' | 'medium' | 'high', category: string, description?: string) => {
        const tempId = Math.random().toString()
        const newTask: Task = {
            id: tempId,
            title,
            priority,
            category,
            description,
            is_complete: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }
        setTasks([newTask, ...tasks])
        setShowInput(false)

        try {
            const { error } = await supabase
                .from('tasks')
                .insert([{ title, priority, category, description }])
            if (error) throw error
            await fetchTasks()
        } catch (e) {
            setTasks(tasks.filter(t => t.id !== tempId))
            console.error(e)
        }
    }

    const handleQuickAdd = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!quickTitle.trim()) return
        await addTask(quickTitle, 'medium', 'General')
        setQuickTitle('')
    }

    const toggleTask = async (id: string, isComplete: boolean) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, is_complete: isComplete, updated_at: new Date().toISOString() } : t))
        await supabase.from('tasks').update({ is_complete: isComplete, updated_at: new Date().toISOString() }).eq('id', id)
    }

    const deleteTask = async (id: string) => {
        setTasks(tasks.filter(t => t.id !== id))
        await supabase.from('tasks').delete().eq('id', id)
    }

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
        const matchesTab =
            filter === 'All' ? true :
                filter === 'To Do' ? !task.is_complete :
                    task.is_complete
        const matchesCat = catFilter === 'All Apps' ? true : task.category === catFilter
        return matchesSearch && matchesTab && matchesCat
    })

    if (!session) return <Auth onAuthSuccess={() => fetchTasks()} />

    return (
        <div className="relative flex min-h-screen w-full flex-col max-w-[430px] mx-auto shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark font-display">

            {/* Dynamic Header */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 justify-between max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                        {activeTab === 'stats' ? (
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-rounded text-primary">calendar_month</span>
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{getWeekRange()}</span>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-rounded text-primary text-2xl font-bold">
                                    {activeTab === 'overview' ? 'dashboard' : activeTab === 'calendar' ? 'calendar_month' : activeTab === 'settings' ? 'settings' : 'task_alt'}
                                </span>
                                <div className="flex flex-col">
                                    <h1 className="text-sm font-bold leading-tight tracking-tight">
                                        {activeTab === 'overview'
                                            ? `Hello, ${session.user.email?.split('@')[0]}`
                                            : activeTab === 'calendar' ? 'Task Calendar'
                                                : activeTab === 'settings' ? 'Settings'
                                                    : 'TaskFlow'}
                                    </h1>
                                    <p className="text-[10px] text-slate-500 font-medium">{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-slate-500 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <span className="material-symbols-rounded">
                                {activeTab === 'stats' ? 'share' : activeTab === 'tasks' ? 'more_horiz' : 'search'}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto no-scrollbar relative">
                {loading ? (
                    <div className="px-6 py-8 space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/40 rounded-[28px] animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500 h-full">
                        {activeTab === 'overview' && <Dashboard tasks={tasks} session={session} />}
                        {activeTab === 'calendar' && <TaskCalendar tasks={tasks} />}
                        {activeTab === 'stats' && <TaskStats tasks={tasks} />}
                        {activeTab === 'settings' && <Settings user={session.user} />}
                        {activeTab === 'tasks' && (
                            <div className="space-y-4">
                                <div className="px-6 pt-4 space-y-4">
                                    <div className="flex w-full items-stretch rounded-xl h-11 bg-slate-200/50 dark:bg-slate-800/50 border border-transparent focus-within:border-primary/50 transition-all">
                                        <div className="flex items-center justify-center pl-4 text-slate-500 dark:text-slate-400">
                                            <span className="material-symbols-rounded text-xl">search</span>
                                        </div>
                                        <input
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-base placeholder:text-slate-500 dark:placeholder:text-slate-400 px-3 outline-none"
                                            placeholder="Search tasks..."
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
                                        {['All', 'To Do', 'Done'].map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFilter(t)}
                                                className={twMerge(
                                                    "flex flex-col items-center justify-center pb-3 transition-colors relative",
                                                    filter === t ? "text-primary border-b-2 border-primary" : "text-slate-500 dark:text-slate-400 border-b-2 border-transparent"
                                                )}
                                            >
                                                <span className="text-sm font-semibold">{t}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        {['All Apps', 'Work', 'Personal', 'Health', 'Shopping'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCatFilter(cat)}
                                                className={twMerge(
                                                    "whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                                                    catFilter === cat
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                                        : "bg-surface-light dark:bg-surface-dark border-slate-200/60 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 hover:border-primary/50 active:scale-95"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="px-6 py-2">
                                    <form
                                        onSubmit={handleQuickAdd}
                                        className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-1 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Add a task quickly..."
                                            value={quickTitle}
                                            onChange={(e) => setQuickTitle(e.target.value)}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold px-4 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 dark:text-white"
                                        />
                                        <button type="submit" className="bg-primary text-white size-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-transform">
                                            <span className="material-symbols-rounded font-bold">add</span>
                                        </button>
                                    </form>
                                </div>

                                <div className="px-6 pb-20 space-y-4">
                                    {filteredTasks.length > 0 ? (
                                        filteredTasks.map(task => (
                                            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-20 pb-10">
                                            <div className="size-48 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                                                <img src="/empty_tasks_illustration_1769853486113.png" alt="No Tasks" className="w-full h-full object-cover scale-110 opacity-50" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">You're all done!</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Enjoy your free time.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Floating Action Button */}
            {['overview', 'calendar', 'tasks'].includes(activeTab) && (
                <div className="fixed bottom-24 right-6 sm:absolute sm:bottom-24 z-30">
                    <button
                        onClick={() => setShowInput(true)}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-90 transition-transform hover:scale-105"
                    >
                        <span className="material-symbols-rounded text-[28px] font-bold">add</span>
                    </button>
                </div>
            )}

            {/* Add Task Screen */}
            {showInput && (
                <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark max-w-[430px] mx-auto animate-in slide-in-from-bottom duration-500 overflow-hidden">
                    <TaskInput onAddTask={addTask} onCancel={() => setShowInput(false)} />
                </div>
            )}

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-8 pt-3 z-40">
                <div className="max-w-md mx-auto flex justify-around items-center">
                    {[
                        { id: 'tasks', icon: 'check_box', label: 'Tasks' },
                        { id: 'calendar', icon: 'calendar_month', label: 'Schedule' },
                        { id: 'overview', icon: 'grid_view', label: 'Dashboard' },
                        { id: 'stats', icon: 'monitoring', label: 'Insights' },
                        { id: 'settings', icon: 'settings', label: 'Settings' },
                    ].map(nav => (
                        <button
                            key={nav.id}
                            onClick={() => setActiveTab(nav.id)}
                            className={twMerge("flex flex-col items-center gap-1.5 transition-all outline-none", activeTab === nav.id ? "text-primary" : "text-slate-400 dark:text-slate-500")}
                        >
                            <span className="material-symbols-rounded text-[26px]" style={{ fontVariationSettings: activeTab === nav.id ? "'FILL' 1" : undefined }}>{nav.icon}</span>
                            <span className="text-[10px] font-bold tracking-tight">{nav.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <div className="fixed bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-300 dark:bg-slate-700/50 rounded-full z-50 max-w-[430px]"></div>
        </div>
    )
}
