class Auth {

    static registerUser(email, password) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/api/users');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (this.status == 200) {
                alert(this.response.message);
            } else {
                
            }
        };
        var data = {
            email: email,
            password: password
        }
        xhr.send(JSON.stringify(data));
    }

    static authenticateUser(email, password) {
        let xhr = new XMLHttpRequest();
        xhr.open('post', '/api/authenticate');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (this.status == 200) {
                let token = this.response.token;
                if (token === null) {
                    // BAD
                }
                Auth.setToken(token);
            } else {
                // BAD
            }
        };
        var data = {
            email: email,
            password: password
        }
        xhr.send(JSON.stringify(data));
    }

    static isUserAuthenticated() {
        return localStorage.getItem('jwt') !== null;
    }

    static getToken() {
        return localStorage.getItem('jwt');
    }

    static setToken(token) {
        localStorage.setItem('jwt', token);
    }

    static removeToken() {
        localStorage.removeItem('jwt');
    }
}

export default Auth;