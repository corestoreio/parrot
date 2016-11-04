-- CREATE EXTENSION hstore;

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    keys text[]
);

CREATE TABLE locales (
    id SERIAL PRIMARY KEY,
    ident TEXT NOT NULL,
    pairs hstore,
    project_id INTEGER REFERENCES projects (id) ON DELETE CASCADE,
    UNIQUE (ident, project_id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    UNIQUE (email)
);