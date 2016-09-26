CREATE TABLE documents (
    id serial PRIMARY KEY,
    pairs hstore
);

CREATE TABLE projects (
    id serial PRIMARY KEY,
    keys text[]
);