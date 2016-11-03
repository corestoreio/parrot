import { getToken } from './token';
import { browserHistory } from 'react-router';

export const extractJson = (response) => {
    if (!response.ok) {
        console.log(response);
        throw response.status;
    }
    return response.json();
};


export const apiRequest = (config={}) => {
    const headers = {
        "Accept": 'application/json',
    };
    
    if (config.includeAuth) {
        const token = getToken();
        if (!token) {
            return browserHistory.push('/login');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(config.path, {
        method: config.method,
        headers: headers,
        body: config.body
    })
    .then(res => extractJson(res))
};