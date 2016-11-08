-- CREATE EXTENSION hstore;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    keys text[]
);

CREATE TABLE locales (
    id SERIAL PRIMARY KEY,
    ident TEXT NOT NULL,
    language TEXT NOT NULL,
    country TEXT NOT NULL,
    pairs hstore,
    project_id INTEGER REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (ident, project_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (email)
);

CREATE TABLE projects_users (
    user_id INTEGER REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    project_id INTEGER REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    role TEXT NOT NULL,
    CONSTRAINT projects_users_pkey PRIMARY KEY (user_id, project_id)
);