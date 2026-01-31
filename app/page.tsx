import { TaskManager } from '@/components/TaskManager'

export default function Home() {
  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark selection:bg-primary/10">
      <TaskManager />
    </main>
  )
}
