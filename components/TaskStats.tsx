'use client'

import { Task } from '@/types/task'
import { twMerge } from 'tailwind-merge'

interface TaskStatsProps {
    tasks: Task[]
}

export function TaskStats({ tasks }: TaskStatsProps) {
    const totalCompleted = tasks.filter(t => t.is_complete).length
    const totalTasks = tasks.length
    const completionRate = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100)

    // Group tasks by category for breakdown
    const categoryCounts = tasks.reduce((acc: any, task) => {
        const cat = task.category || 'General'
        acc[cat] = (acc[cat] || 0) + 1
        return acc
    }, {})

    const categoryEntries = Object.entries(categoryCounts).map(([name, count]: [string, any]) => ({
        name,
        count,
        percent: totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100)
    })).sort((a, b) => b.count - a.count)

    // Real Daily Completion Data (Last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dateStr = date.toISOString().split('T')[0]
        const count = tasks.filter(t => t.is_complete && t.updated_at?.startsWith(dateStr)).length
        return {
            label: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
            count,
            dateStr
        }
    })

    const maxCount = Math.max(...last7Days.map(d => d.count), 1)

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
            {/* Headline Section */}
            <section className="px-6 pt-8 pb-4">
                <h3 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white uppercase tracking-[0.05em]">Insights</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-widest mt-1 opacity-70">
                    Real-time Performance Analysis
                </p>
            </section>

            {/* Charts Section */}
            <section className="p-4">
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] p-8 shadow-sm">
                    <div className="flex flex-col gap-1 mb-10 text-center items-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Tasks Completed (7d)</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{totalCompleted}</p>
                            <div className="flex flex-col items-start leading-none gap-0.5">
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Total</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</span>
                            </div>
                        </div>
                    </div>

                    {/* Real Data Chart */}
                    <div className="flex items-end justify-between h-44 gap-3 px-2">
                        {last7Days.map((day, i) => {
                            const height = `${(day.count / maxCount) * 100}%`
                            const isActive = i === 6 // Today
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-4 h-full justify-end group cursor-pointer">
                                    <div className="w-full flex flex-col items-center gap-1.5 h-full justify-end">
                                        {day.count > 0 && (
                                            <span className="text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity mb-1">{day.count}</span>
                                        )}
                                        <div
                                            className={twMerge(
                                                "w-full max-w-[12px] rounded-full transition-all duration-700 ease-out-back relative",
                                                isActive ? "bg-primary shadow-lg shadow-primary/30" :
                                                    day.count > 0 ? "bg-primary/40" : "bg-slate-100 dark:bg-slate-800"
                                            )}
                                            style={{ height: day.count > 0 ? height : '8px', minHeight: '8px' }}
                                        >
                                            {isActive && <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-full"></div>}
                                        </div>
                                    </div>
                                    <span className={twMerge(
                                        "text-[10px] font-black tracking-tight transition-colors",
                                        isActive ? "text-primary" : "text-slate-400 dark:text-slate-500"
                                    )}>
                                        {day.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Weekly Goal Progress */}
            <section className="px-4 py-2">
                <div className="bg-surface-light dark:bg-surface-dark border border-slate-200/60 dark:border-slate-800/60 rounded-[32px] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-rounded text-primary text-2xl font-bold">analytics</span>
                            </div>
                            <p className="text-sm font-black tracking-tight uppercase tracking-wider">Productivity Score</p>
                        </div>
                        <span className="text-xl font-black text-primary italic">{completionRate}%</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5 shadow-inner p-1">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-1000 relative shadow-lg"
                            style={{ width: `${completionRate}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                            {totalCompleted} / {totalTasks} FINISHED
                        </p>
                        <div className={twMerge(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                            completionRate >= 80 ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10"
                        )}>
                            <div className={`size-1.5 rounded-full ${completionRate >= 80 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                            {completionRate >= 80 ? 'Performance Elite' : 'Building Momentum'}
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Breakdown */}
            <section className="px-6 pt-8 pb-2">
                <h4 className="text-sm font-black tracking-[0.2em] text-slate-400 dark:text-slate-600 uppercase italic">Focus Areas</h4>
            </section>
            <section className="px-4 flex flex-col gap-3 pb-8">
                {categoryEntries.length > 0 ? categoryEntries.map((cat, i) => (
                    <div key={cat.name} className="flex items-center justify-between p-5 bg-surface-light dark:bg-surface-dark border border-slate-200/60 dark:border-slate-800/60 rounded-[28px] shadow-sm transition-all hover:border-primary/40 group active:scale-[0.98]">
                        <div className="flex items-center gap-4">
                            <div className={twMerge(
                                "size-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform",
                                i % 3 === 0 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                    i % 3 === 1 ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                                        "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                            )}>
                                <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {cat.name === 'Work' ? 'work' : cat.name === 'Health' ? 'favorite' : cat.name === 'Shopping' ? 'shopping_bag' : 'home'}
                                </span>
                            </div>
                            <div>
                                <p className="text-[15px] font-black text-slate-900 dark:text-white tracking-tight">{cat.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{cat.count} tasks logged</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-primary italic">{cat.percent}%</p>
                        </div>
                    </div>
                )) : (
                    <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] flex flex-col items-center gap-3 text-slate-400 opacity-40">
                        <span className="material-symbols-rounded text-4xl">bar_chart_4_bars</span>
                        <p className="text-[10px] font-black uppercase tracking-widest text-center">No category data yet.<br />Start adding tasks!</p>
                    </div>
                )}
            </section>
            <div className="h-32"></div>
        </div>
    )
}
