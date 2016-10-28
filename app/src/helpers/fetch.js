export const extractJson = (response) => {
    if (!response.ok) {
        throw new Error('request failed');
    }
    return response.json();
}