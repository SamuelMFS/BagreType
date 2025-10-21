-- Create user_progress table to track baseline test completion
create table public.user_progress (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  baseline_completed boolean not null default false,
  baseline_wpm integer,
  baseline_accuracy integer,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique(user_id)
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Create policies
create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_user_progress_updated_at
  before update on public.user_progress
  for each row execute procedure public.handle_updated_at();
