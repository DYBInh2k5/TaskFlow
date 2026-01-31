# Setup Instructions

1.  **Supabase Setup**
    *   Create a new project on [Supabase](https://supabase.com).
    *   Go to the **SQL Editor** in your Supabase dashboard.
    *   Copy the contents of `schema.sql` (in this folder) and run it to create the database table.

2.  **Environment Variables**
    *   Create a file named `.env.local` in this folder.
    *   Add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```
    *   You can find these in Supabase Settings -> API.

3.  **Run the App**
    *   Run `npm run dev` to start the server.
