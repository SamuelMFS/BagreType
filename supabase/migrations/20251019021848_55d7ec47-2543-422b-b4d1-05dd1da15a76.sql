-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

alter table public.profiles enable row level security;

-- Create typing sessions table to store user typing metrics
create table public.typing_sessions (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  wpm integer not null,
  raw_wpm integer not null,
  accuracy decimal(5,2) not null,
  consistency decimal(5,2),
  time_seconds integer not null,
  mode text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.typing_sessions enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS policies for typing sessions
create policy "Users can view their own typing sessions"
  on public.typing_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own typing sessions"
  on public.typing_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own typing sessions"
  on public.typing_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own typing sessions"
  on public.typing_sessions for delete
  using (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();