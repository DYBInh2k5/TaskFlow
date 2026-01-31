import { Task } from '@/types/task'

interface DashboardProps {
    tasks: Task[]
    session: any
}

export function Dashboard({ tasks, session }: DashboardProps) {
    const total = tasks.length
    const completed = tasks.filter(t => t.is_complete).length
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

    // Dynamic Streak (Calculated based on completed tasks today)
    const today = new Date().toISOString().split('T')[0]
    const completedToday = tasks.filter(t => t.is_complete && t.updated_at?.startsWith(today)).length

    // Circle stats
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    const categories = [
        { name: 'Work', count: tasks.filter(t => t.category === 'Work' && !t.is_complete).length, icon: 'work', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
        { name: 'Personal', count: tasks.filter(t => t.category === 'Personal' && !t.is_complete).length, icon: 'home', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-blue-400' },
        { name: 'Health', count: tasks.filter(t => t.category === 'Health' && !t.is_complete).length, icon: 'favorite', color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400' },
        { name: 'Shopping', count: tasks.filter(t => t.category === 'Shopping' && !t.is_complete).length, icon: 'shopping_bag', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' },
    ]

    return (
        <div className="flex flex-col w-full pb-32">
            {/* Daily Streak & Rank */}
            <section className="px-6 pt-6 mb-8 flex gap-4">
                <div className="flex-1 bg-gradient-to-br from-primary to-blue-600 rounded-3xl p-5 text-white shadow-lg shadow-primary/20 relative overflow-hidden group transition-all hover:scale-[1.02]">
                    <div className="absolute -right-4 -top-4 size-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <div className="size-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="material-symbols-rounded text-xl font-bold">local_fire_department</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Streak</span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">{completedToday > 0 ? '1 Day' : '0 Days'}</p>
                    <p className="text-[10px] font-bold text-white/70 mt-1 uppercase tracking-wider">
                        {completedToday > 0 ? 'Nicely done today!' : 'Start your streak!'}
                    </p>
                </div>

                <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-primary/40 transition-all active:scale-[0.98]">
                    <div className="flex justify-between items-start">
                        <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-500">
                            <span className="material-symbols-rounded text-xl font-bold">military_tech</span>
                        </div>
                        <span className="material-symbols-rounded text-slate-300 dark:text-slate-600 text-lg">arrow_outward</span>
                    </div>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Rank #{completed > 50 ? '1' : completed > 20 ? '2' : completed > 5 ? '3' : '4'}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-wider">Level based on {completed} done</p>
                    </div>
                </div>
            </section>

            {/* Daily Progress Card */}
            <section className="px-6 mb-10">
                <div className="bg-surface-light dark:bg-surface-dark rounded-[32px] p-6 flex items-center justify-between border border-slate-200/60 dark:border-slate-800/60 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-col gap-1">
                        <p className="text-slate-900 dark:text-white text-xl font-black tracking-tight">Daily Progress</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">
                            {completed} of {total} tasks done
                        </p>
                        <div className="mt-5 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em]">
                            {progress > 80 ? "Almost there!" : progress > 0 ? "Great job!" : "Let's get started!"}
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <svg className="w-24 h-24 -rotate-90">
                            <circle
                                className="text-slate-100 dark:text-slate-800"
                                cx="48" cy="48" fill="transparent" r="38"
                                stroke="currentColor" strokeWidth="10"
                            />
                            <circle
                                className="text-primary"
                                cx="48" cy="48" fill="transparent" r="38"
                                stroke="currentColor"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round" strokeWidth="10"
                            />
                        </svg>
                        <span className="absolute text-xl font-black text-slate-900 dark:text-white">{progress}%</span>
                    </div>
                </div>
            </section>

            {/* Today's Focus Scroll */}
            <section className="mb-10">
                <div className="flex items-center justify-between px-6 mb-4">
                    <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight uppercase tracking-[0.1em]">Today's Focus</h3>
                    <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline">View All</button>
                </div>

                <div className="flex overflow-x-auto no-scrollbar scroll-smooth px-6 gap-4">
                    {tasks.filter(t => !t.is_complete).map((task) => (
                        <div key={task.id} className="flex flex-col gap-4 rounded-[28px] bg-surface-light dark:bg-surface-dark p-4 min-w-[240px] shadow-sm border border-slate-200/60 dark:border-slate-800/60 transition-all hover:border-primary/50 group active:scale-[0.98]">
                            <div
                                className="w-full bg-center bg-no-repeat aspect-[16/10] bg-cover rounded-2xl flex flex-col relative overflow-hidden"
                                style={{ backgroundImage: `url("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80&auto=format&fit=crop")` }}
                            >
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                {task.priority === 'high' && (
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 backdrop-blur-md size-8 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                        <span className="material-symbols-rounded text-primary text-lg font-bold">priority_high</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-1">
                                <p className="text-slate-900 dark:text-white text-base font-black tracking-tight leading-tight line-clamp-1">{task.title}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{task.category || 'General'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {tasks.filter(t => !t.is_complete).length === 0 && (
                        <div className="flex flex-col gap-3 rounded-[28px] bg-surface-light dark:bg-surface-dark/50 p-10 min-w-[240px] border border-dashed border-slate-200 dark:border-slate-800 items-center justify-center text-slate-400">
                            <span className="material-symbols-rounded text-4xl opacity-30">verified</span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">All caught up!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories Grid */}
            <section className="px-6 mb-12">
                <h3 className="text-slate-900 dark:text-white text-lg font-black tracking-tight mb-5 uppercase tracking-[0.1em]">Categories</h3>
                <div className="grid grid-cols-2 gap-4">
                    {categories.map(cat => (
                        <div key={cat.name} className="bg-surface-light dark:bg-surface-dark p-6 rounded-[32px] shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-5 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer group active:scale-[0.98]">
                            <div className={`size-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${cat.color}`}>
                                <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{cat.icon}</span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white font-black text-lg tracking-tight leading-none">{cat.name}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">{cat.count} tasks left</p>
                            </div>
                        </div>
                    ))}
                    <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-[32px] border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all active:scale-[0.98]">
                        <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-rounded text-3xl font-bold">add</span>
                        </div>
                        <p className="text-primary font-black text-xs uppercase tracking-[0.2em]">Add Category</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
