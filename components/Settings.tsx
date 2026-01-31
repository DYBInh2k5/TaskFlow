'use client'

import { useState, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import { supabase } from '@/lib/supabaseClient'

interface SettingItem {
    id: string
    icon: string
    label: string
    color: string
    value?: string
    type?: 'toggle' | 'link' | 'select'
    active?: boolean
}

interface SettingGroup {
    title: string
    items: SettingItem[]
}

interface SettingsProps {
    user: any
}

export function Settings({ user }: SettingsProps) {
    // State management for interactions
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark')
        }
        return true
    })
    const [notifications, setNotifications] = useState(true)
    const [securityLock, setSecurityLock] = useState(false)
    const [language, setLanguage] = useState('English (US)')
    const [theme, setTheme] = useState('Modern Blue')

    // Modal state
    const [modal, setModal] = useState<{ type: string; title: string; content: string } | null>(null)

    // Effect for Dark Mode
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
    }

    const handleItemClick = (item: SettingItem) => {
        if (item.type === 'toggle') {
            if (item.id === 'dark_mode') setIsDarkMode(!isDarkMode)
            if (item.id === 'notifications') setNotifications(!notifications)
            if (item.id === 'security_lock') setSecurityLock(!securityLock)
        } else {
            // Logic for links/modals
            if (item.id === 'language') {
                const langs = ['English (US)', 'Tiếng Việt', '日本語', 'Français']
                const nextLang = langs[(langs.indexOf(language) + 1) % langs.length]
                setLanguage(nextLang)
            } else if (item.id === 'theme') {
                const themes = ['Modern Blue', 'Midnight Purple', 'Emerald Forest', 'Sunset Rose']
                const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length]
                setTheme(nextTheme)
            } else if (item.id === 'privacy') {
                setModal({
                    type: 'info',
                    title: 'Privacy Policy',
                    content: 'Your data is encrypted and stored securely in Supabase. We do not share your personal information with third parties.'
                })
            } else if (item.id === 'tos') {
                setModal({
                    type: 'info',
                    title: 'Terms of Service',
                    content: 'By using TaskFlow, you agree to organize your life productively and enjoy our premium task management features.'
                })
            } else if (item.id === 'profile' || item.id === 'email') {
                setModal({
                    type: 'info',
                    title: 'Account Info',
                    content: `You are logged in as ${user?.email}. Your profile is synced across all devices.`
                })
            }
        }
    }

    const settingsGroups: SettingGroup[] = [
        {
            title: 'Account',
            items: [
                { id: 'profile', icon: 'person', label: 'Profile Information', color: 'bg-blue-500', value: user?.email?.split('@')[0] || 'User', type: 'link' },
                { id: 'email', icon: 'mail', label: 'Email Address', color: 'bg-emerald-500', value: user?.email || 'No email', type: 'link' },
                { id: 'notifications', icon: 'notifications', label: 'Notifications', color: 'bg-rose-500', type: 'toggle', active: notifications },
            ]
        },
        {
            title: 'Appearance',
            items: [
                { id: 'dark_mode', icon: 'dark_mode', label: 'Dark Mode', color: 'bg-indigo-600', type: 'toggle', active: isDarkMode },
                { id: 'theme', icon: 'palette', label: 'App Theme', color: 'bg-amber-500', value: theme, type: 'link' },
                { id: 'language', icon: 'language', label: 'Language', color: 'bg-cyan-500', value: language, type: 'link' },
            ]
        },
        {
            title: 'Safety & Privacy',
            items: [
                { id: 'security_lock', icon: 'lock', label: 'Security Lock', color: 'bg-slate-700', type: 'toggle', active: securityLock },
                { id: 'privacy', icon: 'shield', label: 'Privacy Policy', color: 'bg-emerald-600', type: 'link' },
                { id: 'tos', icon: 'description', label: 'Terms of Service', color: 'bg-slate-500', type: 'link' },
            ]
        }
    ]

    return (
        <div className="flex flex-col bg-background-light dark:bg-background-dark min-h-screen pb-40 relative">
            {/* Modal Overlay */}
            {modal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}></div>
                    <div className="bg-surface-light dark:bg-surface-dark w-full max-w-xs rounded-[32px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 border border-slate-200/60 dark:border-slate-800/60">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tight">{modal.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-bold mb-8 italic">"{modal.content}"</p>
                        <button
                            onClick={() => setModal(null)}
                            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <section className="px-6 pt-10 pb-8 flex flex-col items-center">
                <div className="relative group cursor-pointer active:scale-95 transition-transform" onClick={() => handleItemClick({ id: 'profile', icon: '', label: '', color: '', type: 'link' })}>
                    <div className="size-28 rounded-full border-4 border-white dark:border-surface-dark shadow-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.email || 'U'}&background=0ea5e9&color=fff&bold=true`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 size-9 bg-primary rounded-full border-4 border-white dark:border-surface-dark flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-rounded text-xl">edit</span>
                    </div>
                </div>
                <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">
                    {user?.email?.split('@')[0] || 'User'}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Active Now</p>
                </div>

                <div className="mt-8 flex gap-4 w-full max-w-sm px-4">
                    <div className="flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center shadow-sm">
                        <span className="text-xl font-black text-primary">84</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Done</span>
                    </div>
                    <div className="flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center shadow-sm">
                        <span className="text-xl font-black text-amber-500">12</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Active</span>
                    </div>
                    <div className="flex-1 bg-surface-light dark:bg-surface-dark p-4 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 flex flex-col items-center shadow-sm">
                        <span className="text-xl font-black text-emerald-500">4.8</span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Score</span>
                    </div>
                </div>
            </section>

            {/* Settings Sections */}
            {settingsGroups.map((group, idx) => (
                <section key={idx} className="px-6 mb-8">
                    <h3 className="px-1 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-4">
                        {group.title}
                    </h3>
                    <div className="bg-surface-light dark:bg-surface-dark rounded-[32px] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                        {group.items.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => handleItemClick(item)}
                                className={twMerge(
                                    "flex items-center justify-between p-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors cursor-pointer group",
                                    i !== group.items.length - 1 && "border-b border-slate-100 dark:border-slate-800/50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={twMerge("size-11 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform", item.color)}>
                                        <span className="material-symbols-rounded text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                                    </div>
                                    <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200 tracking-tight">{item.label}</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    {item.value && (
                                        <span className="text-sm font-bold text-slate-400 dark:text-slate-500">{item.value}</span>
                                    )}
                                    {item.type === 'toggle' ? (
                                        <div className={twMerge(
                                            "w-12 h-7 rounded-full relative transition-all duration-300 shadow-inner p-1",
                                            item.active ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                                        )}>
                                            <div className={twMerge(
                                                "size-5 rounded-full bg-white shadow-md transition-all duration-300",
                                                item.active ? "translate-x-5" : "translate-x-0"
                                            )} />
                                        </div>
                                    ) : (
                                        <span className="material-symbols-rounded text-slate-300 dark:text-slate-600">chevron_right</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}

            {/* Danger Zone */}
            <section className="px-6 mt-6 pb-12">
                <button
                    onClick={handleSignOut}
                    className="w-full bg-rose-500 shadow-lg shadow-rose-500/20 text-white py-4.5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-rose-600 active:scale-[0.98] flex items-center justify-center gap-3">
                    <span className="material-symbols-rounded text-xl">logout</span>
                    Sign Out
                </button>
                <button className="w-full mt-6 py-2 text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] hover:text-rose-500 transition-colors">
                    Delete Account
                </button>
            </section>
        </div>
    )
}
