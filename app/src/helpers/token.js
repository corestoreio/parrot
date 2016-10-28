export const storeToken = (token) => {
    localStorage.setItem("token", token);
}

export const getToken = () => localStorage.getItem("token");