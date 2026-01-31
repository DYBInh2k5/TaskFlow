'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { twMerge } from 'tailwind-merge'

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                onAuthSuccess()
            } else {
                const { data, error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                // If signup is successful and confirmation is off, Supabase might not return a session immediately 
                // depending on config, so we force a sign in or just check if data exists.
                if (data.session) {
                    onAuthSuccess()
                } else {
                    // Fallback for some Supabase configs: just tell them to sign in
                    setIsLogin(true)
                    setError("Account created! Please sign in.")
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark items-center justify-center p-6">
            <div className="w-full max-w-md bg-surface-light dark:bg-surface-dark p-8 rounded-[40px] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 transition-all">
                {/* Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative flex items-center justify-center mb-8">
                        {/* Abstract Circular Progress Element */}
                        <div className="absolute h-28 w-28 rounded-full border-[6px] border-primary/20 border-t-primary animate-spin duration-[3000ms]"></div>
                        {/* Central Icon */}
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                            <span className="material-symbols-rounded text-primary text-[42px] font-bold">
                                check_circle
                            </span>
                        </div>
                    </div>
                    <h1 className="text-[#111318] dark:text-white tracking-tight text-[36px] font-bold leading-tight">
                        <span className="text-primary">Task</span><span className="font-light">Flow</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 italic">Productivity & Completion</p>
                </div>

                {/* Form */}
                <form onSubmit={handleAuth} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                        <div className="relative group">
                            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">mail</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl h-14 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Password</label>
                        <div className="relative group">
                            <span className="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-primary transition-colors">lock</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl h-14 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-wider p-3 rounded-xl flex items-center gap-2">
                            <span className="material-symbols-rounded text-sm">error</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold p-4 rounded-2xl flex flex-col gap-2 animate-in fade-in zoom-in duration-300">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-rounded text-lg">mark_email_read</span>
                                <span className="uppercase tracking-widest font-black text-[10px]">Verification Sent!</span>
                            </div>
                            <p className="opacity-80 leading-relaxed">Please check your inbox at <span className="font-black underline">{email}</span> to confirm your account.</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <span className="material-symbols-rounded">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>

            {/* Social Logins (Simple UI for demo) */}
            <div className="mt-10 flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] mb-6">Or continue with</p>
                <div className="flex gap-4">
                    <button className="size-12 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="size-5" alt="Google" />
                    </button>
                    <button className="size-12 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                        <img src="https://www.svgrepo.com/show/303108/apple-black.svg" className="size-5 dark:invert" alt="Apple" />
                    </button>
                </div>
            </div>
        </div>
    )
}
