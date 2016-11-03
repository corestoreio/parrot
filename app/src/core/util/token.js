import jwt_decode from 'jwt-decode';

export const storeToken = (token) => {
    localStorage.setItem("token", token);
}

export const isTokenValid = (token) => {
    if (!token || token.length <= 0) {
        return false;
    }
    let decoded
    try {
        decoded = jwt_decode(token)
    } catch(e) {
        return false;
    }
    const exp = decoded.exp;
    if (!exp || exp.length <= 0) {
        return false;
    }
    return exp > (Date.now() / 1000);
}

export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!isTokenValid(token)) {
        return null;
    }
    return token;
}
