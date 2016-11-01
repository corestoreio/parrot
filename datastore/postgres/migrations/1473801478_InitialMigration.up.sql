CREATE TABLE projects (
    id serial PRIMARY KEY,
    name varchar(256) NOT NULL CHECK (name <> ''),
    keys text[],
    UNIQUE (name)
);

CREATE TABLE documents (
    id serial PRIMARY KEY,
    locale varchar(128) NOT NULL CHECK (locale <> ''),
    pairs hstore,
    project_id integer REFERENCES projects (id) ON DELETE CASCADE,
    UNIQUE (locale, project_id)
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    email varchar(256) NOT NULL,
    password varchar(256) NOT NULL,
    role varchar(16) NOT NULL,
    UNIQUE (email)
);