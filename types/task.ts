export interface Task {
    id: string
    created_at: string
    updated_at?: string
    title: string
    description?: string
    is_complete: boolean
    priority: 'low' | 'medium' | 'high'
    category?: string
    due_date?: string
}
