const config = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('access_token')
    },
    host: 'http://localhost:5000'
}

export default config;