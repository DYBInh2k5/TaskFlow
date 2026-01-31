-- Create a table for public tasks (simplest version)
create table
  public.tasks (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    title text not null,
    description text null,
    is_complete boolean not null default false,
    constraint tasks_pkey primary key (id)
  ) tablespace pg_default;

-- Setup Row Level Security (RLS)
-- For a personal demo without Auth, we can allow public access (NOT RECOMMENDED FOR PROD but ok for quick start)
-- OR we just enable RLS and add a policy for anonymous access.

alter table public.tasks enable row level security;

-- Policy to allow anonymous access (if you want to test without login initially)
create policy "Enable all access for all users" on public.tasks
  for all using (true) with check (true);
