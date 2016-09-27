CREATE TABLE projects (
    id serial PRIMARY KEY,
    keys text[]
);

CREATE TABLE documents (
    id serial PRIMARY KEY,
    language varchar(128),
    pairs hstore,
    project_id integer REFERENCES projects (id) ON DELETE CASCADE
);