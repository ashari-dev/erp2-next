create extension if not exists "pgcrypto";

-- =====================================================
-- PROFILES
-- =====================================================

create table public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,

    full_name varchar(255) not null,

    email varchar(255) not NULL,

    phone varchar(50),

    avatar_url text,

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =====================================================
-- COMPANIES
-- =====================================================

create table public.companies (
    id uuid primary key default gen_random_uuid(),

    code varchar(50) unique not null,

    name varchar(255) not null,

    address text,

    phone varchar(50),

    email varchar(255),

    is_active boolean default true,

created_by uuid references auth.users(id),
updated_by uuid references auth.users(id),

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =====================================================
-- DEPARTMENTS
-- =====================================================

create table public.departments (
    id uuid primary key default gen_random_uuid(),

    company_id uuid not null
        references companies(id)
        on delete cascade,

    code varchar(50) not NULL,

    name varchar(255) not null,

    description text,

    is_active boolean default true,

    created_by uuid references auth.users(id),
updated_by uuid references auth.users(id),

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    UNIQUE(company_id, code)
);

-- =====================================================
-- ROLES
-- =====================================================

CREATE TYPE role_level AS ENUM ('holding', 'company');

create table public.roles (
    id uuid primary key default gen_random_uuid(),

    code varchar(50) unique not null,

    name varchar(255) not null,

    description text,

    level role_level not null default 'company',

    is_active boolean default true,

    created_at timestamptz default now()
);

INSERT INTO roles(code, name, level) VALUES
('owner_holding', 'Owner Holding', 'holding'),
('admin_holding', 'Admin Holding', 'holding'),
('manager_holding', 'Manager Holding', 'holding'),
('director', 'Director', 'company'),
('manager', 'Manager', 'company'),
('staff', 'Staff', 'company'),
('supervisor', 'Supervisor', 'company'),
('viewer', 'Viewer', 'company');

-- =====================================================
-- PERMISSIONS
-- =====================================================

create table public.permissions (
    id uuid primary key default gen_random_uuid(),
    
    code varchar(100) not null,
    module varchar(100) not null,

    group_module varchar(100) not null,

    description text,

    created_at timestamptz default now(),

    unique(code, group_module)
);

-- =====================================================
-- ROLE PERMISSIONS
-- =====================================================

create table public.role_permissions (
    id uuid primary key default gen_random_uuid(),

    role_id uuid not null
        references roles(id)
        on delete cascade,

    permission_id uuid not null
        references permissions(id)
        on delete cascade,

    can_view boolean default false,
    can_create boolean default false,
    can_update boolean default false,
    can_delete boolean default false,
    can_approve boolean default false,
    

    unique(role_id, permission_id)
);

-- =====================================================
-- USER COMPANIES
-- =====================================================

create table public.user_companies (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    company_id uuid not null
        references companies(id)
        on delete cascade,

    role_id uuid
        references roles(id),

    is_owner boolean default false,

    created_at timestamptz default now(),
    unique(user_id, company_id)
);

-- =====================================================
-- USER DEPARTMENTS
-- =====================================================

create table public.user_departments (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    department_id uuid not null
        references departments(id)
        on delete cascade,

    created_at timestamptz default now(),

    unique(user_id, department_id)
);

-- =====================================================
-- PROJECTS
-- =====================================================

create table public.projects (
    id uuid primary key default gen_random_uuid(),

    company_id uuid not null
        references companies(id)
        on delete cascade,
    
    department_id uuid 
        references departments(id)
        on delete cascade,

    code varchar(50),

    name varchar(255) not null,

    description text,

    start_date date,

    end_date date,

    status varchar(50) default 'draft',

    is_active boolean default true,

    created_by uuid references auth.users(id),
updated_by uuid references auth.users(id),

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- =====================================================
-- PROJECT MEMBERS
-- =====================================================

create table public.project_members (
    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references projects(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    role varchar(100),

    created_at timestamptz default now(),

    unique(project_id, user_id)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin

  insert into public.profiles (
      id,
      email,
      full_name
  )
  values (
      new.id,
      new.email,
      coalesce(
          new.raw_user_meta_data->>'full_name',
          ''
      )
  );

  return new;

end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();