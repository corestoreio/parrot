export interface Project {
    id: string;
    name: string;
    keys: string[];
}

export interface UpdateProjectNamePayload {
    id: string;
    name: string;
}