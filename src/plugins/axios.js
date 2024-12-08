import axios from 'axios'

const token = JSON.parse(localStorage.getItem('store'))
console.log(token);


const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api/',
    headers: {
        "x-token":token
    }
}); 

export default apiClient