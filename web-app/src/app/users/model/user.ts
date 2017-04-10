import { ProjectUser } from './projectuser';

export interface User {
    id?: string;
    name?: string;
    email: string;
    password?: string;
    role?: string;
    projectRoles?: Map<string, string>;
    projectGrants?: Map<string, Array<string>>;
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
}
