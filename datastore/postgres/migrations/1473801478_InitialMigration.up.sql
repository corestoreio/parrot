CREATE TABLE documents (
    id serial PRIMARY KEY,
    language varchar(128),
    pairs hstore
);

CREATE TABLE projects (
    id serial PRIMARY KEY,
    keys text[]
);