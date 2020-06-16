import axios from 'axios';
import config from './config';

const apiURL = `${config.serverURL}/api`;
const http = {};
['get', 'post', 'put', 'delete'].forEach(method => {
    http[method] = (url, body) => {
        let params = {};
        params.url = `${apiURL}${url}`;
        if (method === 'post' || method === 'put') {
            params.body = body;
        }
        params.options = { headers: config.getHeaders() }
        return axios[method](...Object.values(params)).then(response => response.data)
            .catch(error => Promise.reject(error.response.data))
    }
})

http.loadImage = (userID) => {
    return new Promise((resolve, reject) => {
        fetch(`${config.serverURL}/api/picture/${userID}`, { headers: config.getHeaders() })
            .then(resp => resp.blob())
            .then(blob => {
                const fileReaderInstance = new FileReader();
                fileReaderInstance.readAsDataURL(blob);
                fileReaderInstance.onload = () => {
                    resolve(fileReaderInstance.result);
                }
            }).catch(err => reject(err))
    })
}

export default http;