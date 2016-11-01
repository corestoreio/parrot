export const storeToken = (token) => {
    localStorage.setItem("token", token);
}

export const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token || token.length <= 0) {
        return '';
    }
    return `Bearer ${token}`;
}