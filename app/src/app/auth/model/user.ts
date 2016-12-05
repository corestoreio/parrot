export class User {
    name: string;
    email: string;
    password: string;
    role: string;

    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}