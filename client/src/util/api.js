const api = {};

api.call = (method) => async (uri, body, timeout) => {
    let promise = new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, uri);
        xhr.onload = (e) => {
            res(JSON.parse(xhr.response));
        };
        xhr.onerror = (e) => {
            rej(JSON.parse(xhr.response));
        }
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(body));
    }, timeout || 5000);
    return await promise;
}

api.get = api.call('GET');
api.post = api.call('POST');
api.put = api.call('PUT');
api.delete = api.call('DELETE');

export default api;