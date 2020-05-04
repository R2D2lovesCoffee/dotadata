import axios from 'axios';
import config from './config';

const host = `${config.host}/api`
const http = {};
['get', 'post', 'put', 'delete'].forEach(method => {
    http[method] = (url, body) => {
        let params = {};
        params.url = `${host}${url}`;
        if (method === 'post' || method === 'put') {
            params.body = body;
        }
        params.options = { headers: config.headers }
        return axios[method](...Object.values(params)).then(response => response.data)
            .catch(error => Promise.reject(error.response.data))
    }
})

export default http;