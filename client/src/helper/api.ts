const api = async (method: 'POST' | 'GET' | 'PATCH', action: string, body: object = {}, params:string = "", headers: object = {}) => {
    const token = localStorage.getItem('token');

    if (token) {
        headers = { ...headers, "token": token}
    }

    const payload: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include"
    };

    if (method !== 'GET') {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(`http://localhost:3001/${action}${params}`, payload);
    const responseJson = await response.json();
    if (response.status === 200 || response.status === 201) {
        return responseJson;
    }
    else {
        throw new Error(responseJson.message);
    }
}

export default api;
