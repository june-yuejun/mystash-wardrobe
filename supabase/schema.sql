-- Enable the UUID extension
create extension if not exists "uuid-ossp";

-- Create Items Table
create table public.items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null,
  colorway text,
  season text[] default '{}',
  tags text[] default '{}',
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users default auth.uid()
);

-- Create Outfits Table
create table public.outfits (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  season text,
  year integer,
  is_favorite boolean default false,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users default auth.uid()
);

-- Create Junction Table for Outfit Items
create table public.outfit_items (
  outfit_id uuid references public.outfits(id) on delete cascade,
  item_id uuid references public.items(id) on delete cascade,
  primary key (outfit_id, item_id)
);

-- Enable Row Level Security (RLS)
alter table public.items enable row level security;
alter table public.outfits enable row level security;
alter table public.outfit_items enable row level security;

-- Create Policies (Allow all operations for authenticated users)
-- Note: For a simple personal app, we might want to allow anon access for testing if strict auth isn't implemented yet,
-- but standard practice is to allow authenticated users to manage their own data.

-- Items Policies
create policy "Users can view their own items" on public.items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own items" on public.items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own items" on public.items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own items" on public.items
  for delete using (auth.uid() = user_id);

-- Outfits Policies
create policy "Users can view their own outfits" on public.outfits
  for select using (auth.uid() = user_id);

create policy "Users can insert their own outfits" on public.outfits
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own outfits" on public.outfits
  for update using (auth.uid() = user_id);

create policy "Users can delete their own outfits" on public.outfits
  for delete using (auth.uid() = user_id);

-- Outfit Items Policies (Check parent outfit's ownership)
create policy "Users can view outfit items" on public.outfit_items
  for select using (
    exists (
      select 1 from public.outfits
      where id = outfit_items.outfit_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert outfit items" on public.outfit_items
  for insert with check (
    exists (
      select 1 from public.outfits
      where id = outfit_items.outfit_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete outfit items" on public.outfit_items
  for delete using (
    exists (
      select 1 from public.outfits
      where id = outfit_items.outfit_id
      and user_id = auth.uid()
    )
  );

-- Storage Bucket Setup (You can run this in the Supabase Dashboard if SQL fails for buckets)
insert into storage.buckets (id, name)
values ('wardrobe_images', 'wardrobe_images')
on conflict do nothing;

create policy "Authenticated users can upload images"
on storage.objects for insert
with check ( bucket_id = 'wardrobe_images' and auth.role() = 'authenticated' );

create policy "Authenticated users can view images"
on storage.objects for select
using ( bucket_id = 'wardrobe_images' and auth.role() = 'authenticated' );
