'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { twMerge } from 'tailwind-merge'

interface TaskCalendarProps {
    tasks: Task[]
}

export function TaskCalendar({ tasks }: TaskCalendarProps) {
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [view, setView] = useState<'Week' | 'Month' | 'Agenda'>('Week')

    // Get start of week (Sunday)
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())

    // Generate dates for current week
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek)
        d.setDate(startOfWeek.getDate() + i)
        return d
    })

    const currentMonth = selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    const selectedDateFormatted = selectedDate.toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

    // Filter tasks for the selected day
    const dayTasks = tasks.filter(task => {
        if (!task.created_at) return false
        const taskDate = new Date(task.created_at).toDateString()
        return taskDate === selectedDate.toDateString()
    })

    const changeDate = (days: number) => {
        const next = new Date(selectedDate)
        next.setDate(selectedDate.getDate() + days)
        setSelectedDate(next)
    }

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
            {/* View Tabs */}
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex px-6 gap-8">
                    {['Week', 'Month', 'Agenda'].map((v: any) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={twMerge(
                                "flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 font-black text-xs uppercase tracking-widest transition-all",
                                view === v ? "border-primary text-primary" : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600"
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Weekly Swiper */}
            <section className="p-4 bg-surface-light dark:bg-surface-dark rounded-b-[32px] shadow-sm border-b border-slate-100 dark:border-slate-800/50 mb-4 px-6 pt-6 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{currentMonth}</h3>
                    <div className="flex gap-1">
                        <button onClick={() => changeDate(-7)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                            <span className="material-symbols-rounded text-xl">chevron_left</span>
                        </button>
                        <button onClick={() => changeDate(7)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                            <span className="material-symbols-rounded text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center no-scrollbar overflow-x-auto gap-1">
                    {weekDates.map((date, i) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString()
                        const isToday = date.toDateString() === today.toDateString()
                        const dayName = date.toLocaleString('en-US', { weekday: 'short' })
                        const dayNum = date.getDate()

                        return (
                            <div
                                key={i}
                                onClick={() => setSelectedDate(date)}
                                className={twMerge(
                                    "flex flex-col items-center min-w-[48px] py-3 px-1 rounded-2xl transition-all cursor-pointer active:scale-95",
                                    isSelected
                                        ? "bg-primary text-white shadow-xl shadow-primary/30 scale-110 z-10"
                                        : "text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50",
                                    isToday && !isSelected && "border border-primary/30"
                                )}
                            >
                                <span className="text-[10px] font-black uppercase mb-1.5 opacity-60">{dayName}</span>
                                <span className="text-sm font-black tracking-tight">{dayNum}</span>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* Day Overview */}
            <div className="px-6 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                        {selectedDate.toDateString() === today.toDateString() ? 'Today' : selectedDateFormatted}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">
                        {dayTasks.length} tasks scheduled
                    </p>
                </div>
                <button className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 p-2.5 rounded-xl transition-all hover:bg-primary/10 hover:text-primary">
                    <span className="material-symbols-rounded text-2xl">event_available</span>
                </button>
            </div>

            {/* Vertical Timeline */}
            <section className="px-6 pb-40 mt-4">
                {dayTasks.length > 0 ? (
                    <div className="grid grid-cols-[64px_1fr] relative">
                        <div className="flex flex-col items-start text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-600">
                            {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'].map(time => (
                                <div key={time} className="h-32 pt-1">{time}</div>
                            ))}
                        </div>

                        <div className="relative border-l-2 border-slate-100 dark:border-slate-800/50 pl-6 -ml-[2px] space-y-6">
                            {dayTasks.map((task, i) => (
                                <TimelineItem
                                    key={task.id}
                                    title={task.title}
                                    time={i === 0 ? "09:30 AM" : `${i + 9}:00 AM`}
                                    icon={task.category === 'Work' ? 'work' : task.category === 'Health' ? 'favorite' : 'event'}
                                    color={task.priority === 'high' ? 'emerald' : task.priority === 'medium' ? 'orange' : 'slate'}
                                    priorityLabel={task.priority === 'high' ? "Urgent" : undefined}
                                    isComplete={task.is_complete}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-20 py-10 opacity-40">
                        <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            <span className="material-symbols-rounded text-4xl">event_busy</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No plans for this day</p>
                    </div>
                )}
            </section>
        </div>
    )
}

function TimelineItem({ title, time, icon, color, team, priorityLabel, isComplete }: any) {
    const colors: any = {
        primary: "bg-primary/5 dark:bg-primary/10 border-primary text-primary shadow-sm",
        emerald: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm",
        orange: "bg-orange-500/5 dark:bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400 shadow-sm",
        slate: "bg-surface-light dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400",
    }

    return (
        <div className={twMerge("relative group transition-opacity", isComplete && "opacity-50")}>
            <div className={twMerge(
                "border-l-4 p-5 rounded-[24px] transition-all hover:scale-[1.02] cursor-pointer border group-hover:shadow-md",
                colors[color] || colors.slate
            )}>
                <div className="flex justify-between items-start mb-1.5">
                    <h4 className={twMerge("text-slate-900 dark:text-white font-black text-base tracking-tight leading-snug", isComplete && "line-through")}>{title}</h4>
                    <span className="material-symbols-rounded text-2xl opacity-80">{icon}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{time}</p>
                    {priorityLabel && (
                        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {priorityLabel}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
