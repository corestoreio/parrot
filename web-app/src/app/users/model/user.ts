export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UpdateUserPasswordPayload {
    userId: string;
    oldPassword: string;
    newPassword: string;
    repeatNewPassword?: string;
}

export interface UpdateUserNamePayload {
    userId: string;
    name: string;
}

export interface UpdateUserEmailPayload {
    userId: string;
    email: string;
    password: string;
}