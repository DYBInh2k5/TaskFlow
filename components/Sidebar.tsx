import { LayoutDashboard, ListTodo, Calendar, BarChart3, Settings, LogOut } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

interface SidebarProps {
    activeTab: string
    setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tasks', icon: ListTodo, label: 'Task List' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    ]

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-zinc-200 p-6 flex flex-col">
            <div className="mb-10 flex items-center gap-2 px-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-rounded text-white text-xl font-bold">check_circle</span>
                </div>
                <span className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">TaskFlow</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={twMerge(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                            activeTab === item.id
                                ? "bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10"
                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        )}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-zinc-100 flex flex-col gap-1">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                    <Settings size={20} />
                    Settings
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-50 transition-all">
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    )
}
