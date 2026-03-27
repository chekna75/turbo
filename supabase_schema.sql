-- Table des réservations
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  prenom text not null,
  email text not null,
  telephone text not null,
  service text not null,
  date_debut date not null,
  date_fin date,
  lieu text not null,
  nombre_agents integer default 1,
  details text,
  statut text default 'en_attente' check (statut in ('en_attente','confirmee','annulee','terminee')),
  created_at timestamp with time zone default now()
);

-- Table des agents
create table if not exists agents (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  prenom text not null,
  email text,
  telephone text,
  specialite text,
  statut text default 'actif' check (statut in ('actif','indisponible','inactif')),
  experience text,
  notes text,
  created_at timestamp with time zone default now()
);

-- Table des contacts
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  email text not null,
  sujet text not null,
  message text not null,
  lu boolean default false,
  created_at timestamp with time zone default now()
);

-- Table des posts
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  contenu text not null,
  categorie text default 'actualite',
  publie boolean default false,
  created_at timestamp with time zone default now()
);

-- Sécurité RLS : autoriser l'insertion publique pour réservations et contacts
alter table reservations enable row level security;
alter table agents enable row level security;
alter table contacts enable row level security;
alter table posts enable row level security;

-- Politique : tout le monde peut insérer des réservations/contacts
create policy "Insert reservations" on reservations for insert with check (true);
create policy "Insert contacts" on contacts for insert with check (true);

-- Table des avis clients
create table if not exists avis (
  id uuid default gen_random_uuid() primary key,
  nom text not null,
  service text,
  note integer not null check (note between 1 and 5),
  commentaire text not null,
  approuve boolean default false,
  created_at timestamp with time zone default now()
);

alter table avis enable row level security;
create policy "Insert avis public" on avis for insert with check (true);
create policy "Read avis approuves" on avis for select using (approuve = true OR auth.role() = 'authenticated');
create policy "Admin all avis" on avis for all using (auth.role() = 'authenticated');

-- Table des disponibilités agents
create table if not exists disponibilites (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references agents(id) on delete cascade not null,
  date_debut date not null,
  date_fin date,
  type text default 'disponible' check (type in ('disponible','en_mission','indisponible','conge')),
  note text,
  created_at timestamp with time zone default now()
);

alter table disponibilites enable row level security;
create policy "Admin all disponibilites" on disponibilites for all using (auth.role() = 'authenticated');

-- Politique : seul l'admin authentifié peut tout voir/modifier
create policy "Admin all reservations" on reservations for all using (auth.role() = 'authenticated');
create policy "Admin all agents" on agents for all using (auth.role() = 'authenticated');
create policy "Admin all contacts" on contacts for all using (auth.role() = 'authenticated');
create policy "Admin all posts" on posts for all using (auth.role() = 'authenticated');
