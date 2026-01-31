-- 1. Categories Table (To organize tasks by project or area)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  color text default '#e11d48',
  icon text default 'Folder',
  created_at timestamp with time zone default now()
);

-- 2. Tasks Table (Updated to link with Category)
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  category text default 'General', -- Added for simple code compatibility
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  is_complete boolean default false,
  due_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Subtasks Table (For breaking down big tasks)
create table public.subtasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.tasks(id) on delete cascade,
  title text not null,
  is_complete boolean default false,
  created_at timestamp with time zone default now()
);

-- 4. Notes Table (For personal thoughts or quick reminders)
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  color text default '#ffffff',
  created_at timestamp with time zone default now()
);

-- Setup Row Level Security (RLS) for all tables
alter table public.categories enable row level security;
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.notes enable row level security;

-- Simple Policy for Public Access (Demo only)
create policy "Allow public access" on public.categories for all using (true) with check (true);
create policy "Allow public access" on public.tasks for all using (true) with check (true);
create policy "Allow public access" on public.subtasks for all using (true) with check (true);
create policy "Allow public access" on public.notes for all using (true) with check (true);
