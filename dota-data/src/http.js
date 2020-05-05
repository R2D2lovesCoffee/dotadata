import axios from 'axios';
import config from './config';

const serverURL = process.env.NODE_ENV === 'production' ? `${config.serverURL}/application-server/api` : `${config.serverURL}/api`
const http = {};
['get', 'post', 'put', 'delete'].forEach(method => {
    http[method] = (url, body) => {
        let params = {};
        params.url = `${serverURL}${url}`;
        if (method === 'post' || method === 'put') {
            params.body = body;
        }
        params.options = { headers: config.headers }
        return axios[method](...Object.values(params)).then(response => response.data)
            .catch(error => Promise.reject(error.response.data))
    }
})

export default http;