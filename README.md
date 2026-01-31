# 🚀 TaskFlow - Premium Task Management App

TaskFlow is a high-performance, aesthetically pleasing task management application built with Next.js and Supabase. It features an iOS-inspired design with real-time sync, dark mode support, and productivity insights.

## 📺 Project Demo

https://github.com/DYBInh2k5/TaskFlow/raw/main/Demo.mp4

---

## ✨ Features

- **iOS-Inspired UI:** Premium glassmorphism and smooth animations.
- **Real-time Sync:** Powered by Supabase for instant updates across devices.
- **Dynamic Dashboard:** Track your daily progress and completion streaks.
- **Smart Insights:** Professional charts and category breakdowns of your productivity.
- **Task Calendar:** Plan your week with an interactive timeline.
- **Auth Ready:** Secure login and registration with Supabase Auth.
- **Dark Mode:** Seamless switching between light and dark themes.

## 🛠 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Google Material Symbols](https://fonts.google.com/icons)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/DYBInh2k5/TaskFlow.git
cd taskflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL commands found in `schema.sql` within your Supabase SQL Editor to set up the necessary tables and RLS policies.

### 5. Run the dev server
```bash
npm run dev
```

## 📱 Deploying as a Mobile App

This project is prepared for [Capacitor](https://capacitorjs.com/) integration. To build for Android:
1. `npm run build`
2. `npx cap sync`
3. Open the `android` folder in Android Studio.

---
Built with ❤️ by TaskFlow Team.
