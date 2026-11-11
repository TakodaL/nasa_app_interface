create table if not exists moon_rooms (
  code text primary key,
  payload text not null,
  updated_at timestamptz not null default now()
);
