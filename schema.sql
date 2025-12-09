-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

-- Create posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create likes table
create table public.likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (post_id, user_id)
);

-- Create follows table
create table public.follows (
  follower_id uuid references public.profiles(id) not null,
  following_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- Set up Row Level Security (RLS)
-- For development, we'll allow public read access
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

create policy "Public posts are viewable by everyone." on public.posts for select using (true);
create policy "Users can insert their own posts." on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can update own posts." on public.posts for update using (auth.uid() = user_id);
create policy "Users can delete own posts." on public.posts for delete using (auth.uid() = user_id);

create policy "Public comments are viewable by everyone." on public.comments for select using (true);
create policy "Users can insert their own comments." on public.comments for insert with check (auth.uid() = user_id);

create policy "Public likes are viewable by everyone." on public.likes for select using (true);
create policy "Users can insert their own likes." on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can delete own likes." on public.likes for delete using (auth.uid() = user_id);

create policy "Public follows are viewable by everyone." on public.follows for select using (true);
create policy "Users can insert their own follows." on public.follows for insert with check (auth.uid() = follower_id);
create policy "Users can delete own follows." on public.follows for delete using (auth.uid() = follower_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
