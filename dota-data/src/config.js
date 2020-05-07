const config = {
    getHeaders: () => {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    },
    serverURL: process.env.NODE_ENV === 'production' ? 'https://www.r2d2lovescoffee.com' : 'http://localhost:5000'
}
export default config;