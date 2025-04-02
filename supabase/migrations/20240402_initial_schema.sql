-- Create users table (extends Supabase auth)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);

-- Create policy to allow users to update their own data
create policy "Users can update own data" on public.users
  for update using (auth.uid() = id);

-- Create blog_posts table
create table public.blog_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  dev_to_id text,
  dev_to_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.blog_posts enable row level security;

-- Create policy to allow users to read their own posts
create policy "Users can view own posts" on public.blog_posts
  for select using (auth.uid() = user_id);

-- Create policy to allow users to create their own posts
create policy "Users can create own posts" on public.blog_posts
  for insert with check (auth.uid() = user_id);

-- Create policy to allow users to update their own posts
create policy "Users can update own posts" on public.blog_posts
  for update using (auth.uid() = user_id);

-- Create blog_generation_history table
create table public.blog_generation_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  blog_post_id uuid references public.blog_posts(id) on delete cascade,
  prompt text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.blog_generation_history enable row level security;

-- Create policy to allow users to read their own generation history
create policy "Users can view own generation history" on public.blog_generation_history
  for select using (auth.uid() = user_id);

-- Create policy to allow users to create their own generation history
create policy "Users can create own generation history" on public.blog_generation_history
  for insert with check (auth.uid() = user_id);

-- Create dev_to_integration table
create table public.dev_to_integration (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  api_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.dev_to_integration enable row level security;

-- Create policy to allow users to read their own integration settings
create policy "Users can view own integration settings" on public.dev_to_integration
  for select using (auth.uid() = user_id);

-- Create policy to allow users to update their own integration settings
create policy "Users can update own integration settings" on public.dev_to_integration
  for update using (auth.uid() = user_id);

-- Create policy to allow users to create their own integration settings
create policy "Users can create own integration settings" on public.dev_to_integration
  for insert with check (auth.uid() = user_id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to handle new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 