const api = {};

api.call = (method) => async (uri, timeout) => {
    let promise = new Promise((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, uri);
        xhr.onload = (e) => {
            res(JSON.parse(xhr.response));
        };
        xhr.onerror = (e) => {
            rej(JSON.parse(xhr.response));
        }
        xhr.send();
    }, timeout || 5000);
    return await promise;
}

api.get = api.call('GET');
api.post = api.call('POST');
api.put = api.call('PUT');
api.delete = api.call('DELETE');

export default api;