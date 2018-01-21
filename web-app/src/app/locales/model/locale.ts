export interface Locale {
    id: string;
    ident: string;
    language: string;
    country: string;
    pairs: Pair[];
    project_id: string;
}

export interface Pair {
    key: string;
    value: string;
}
