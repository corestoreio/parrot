CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    keys text[]
);

CREATE TABLE IF NOT EXISTS locales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ident TEXT NOT NULL,
    language TEXT NOT NULL,
    country TEXT NOT NULL,
    pairs hstore,
    project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (ident, project_id)
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS projects_users (
    user_id UUID REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    role TEXT NOT NULL,
    CONSTRAINT projects_users_pkey PRIMARY KEY (user_id, project_id)
);