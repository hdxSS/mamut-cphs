# Supabase Setup Instructions

This guide will help you set up Supabase for the Mamut CPHS application to enable multi-client database access.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up with GitHub or email
3. Verify your email address

## Step 2: Create a New Project

1. Once logged in, click "New Project"
2. Fill in the project details:
   - **Name**: `mamut-cphs` (or any name you prefer)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the region closest to you
   - **Pricing Plan**: Select "Free" tier
3. Click "Create new project"
4. Wait 2-3 minutes for the project to initialize

## Step 3: Get Your API Credentials

1. Once the project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Copy both values - you'll need them in the next step

## Step 4: Configure Environment Variables

1. In your project root (`/home/vibecode/workspace/`), create a file called `.env.local`
2. Add the following content (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file
4. **IMPORTANT**: Restart your development server for the changes to take effect

## Step 5: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor** (in the left sidebar)
2. Click "New query"
3. Copy and paste the following SQL schema:

```sql
-- Create investigaciones table
CREATE TABLE investigaciones (
  id SERIAL PRIMARY KEY,
  folio_id VARCHAR(6) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  edad VARCHAR(50),
  area VARCHAR(255),
  antiguedad VARCHAR(50),
  declaracion_accidente TEXT,
  fecha DATE,
  acciones JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counter table for sequential IDs
CREATE TABLE counter (
  id VARCHAR(50) PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

-- Insert initial counter value
INSERT INTO counter (id, value) VALUES ('folio_counter', 0);

-- Create index for faster queries
CREATE INDEX idx_folio_id ON investigaciones(folio_id);
CREATE INDEX idx_nombre ON investigaciones(nombre);

-- Enable Row Level Security (RLS)
ALTER TABLE investigaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE counter ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (adjust for production)
CREATE POLICY "Allow all operations on investigaciones" ON investigaciones
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on counter" ON counter
  FOR ALL USING (true) WITH CHECK (true);
```

4. Click "Run" (or press Ctrl/Cmd + Enter)
5. You should see "Success. No rows returned" message

## Step 6: Verify Database Setup

1. Go to **Table Editor** in the Supabase sidebar
2. You should see two tables:
   - `investigaciones` (empty for now)
   - `counter` (with one row: folio_counter = 0)

## Step 7: Test the Application

1. Make sure your `.env.local` file has the correct credentials
2. Restart your development server if it's running
3. Open the application in your browser
4. Try creating a new investigation and saving it
5. Check the Supabase Table Editor to confirm the data was saved

## Troubleshooting

### "Failed to fetch" errors
- Make sure your `.env.local` file exists and has the correct values
- Restart the development server after creating/modifying `.env.local`
- Check that the Supabase project URL and anon key are correct

### "relation does not exist" errors
- Make sure you ran the SQL schema in Step 5
- Check the Table Editor to confirm the tables were created

### RLS (Row Level Security) errors
- The policies created in Step 5 allow public access for testing
- For production, you should implement proper authentication and restrict access

## Multi-Client Access

Once set up, multiple users can access the same database by:
1. All clients using the same `.env.local` credentials
2. Deploying the application to a server (Vercel, Netlify, etc.)
3. All users accessing the deployed URL

## Important Notes

- The **Free tier** includes:
  - 500 MB database space
  - 1 GB file storage
  - 2 GB bandwidth
  - 50,000 monthly active users
- Keep your **Database Password** and **anon key** secure
- Never commit `.env.local` to version control (it's already in .gitignore)
- The anon key is safe to use in the browser (it's meant to be public)
- For production, consider implementing proper authentication
