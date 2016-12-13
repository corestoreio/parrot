CREATE TABLE IF NOT EXISTS project_clients (
    client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    secret TEXT NOT NULL,
    project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    UNIQUE (name, project_id)
);