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