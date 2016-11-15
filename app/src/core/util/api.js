import { getToken } from './token';
import { browserHistory } from 'react-router';

export const extractJSON = (response) => {
    if (!response.ok) {
        throw response.status;
    }
    return response.json();
};


export const apiRequest = (config = {}) => {
    const headers = {
        "Accept": 'application/json',
        "Content-Type": 'application/json',
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
        .then(res => extractJSON(res))
        .then(json => json.payload)
};