export interface Locale {
    id: string;
    ident: string;
    language: string;
    country: string;
    pairs: Object;
    project_id: string;
}

export interface Pair {
    key: string;
    value: string;
}