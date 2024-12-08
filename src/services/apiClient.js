import apiClient from '../plugins/axios.js'
import { useAuthStore } from "../store/useAuth.js";

export async function getData(url) {
    try {
        const authStore = useAuthStore();
        const response = await apiClient.get(url, {
            headers: {
                "x-token": authStore.getToken()
            }
        });
        console.log(response.data, url);
        
        return response.data
    } catch (error) {
        console.log('Error en la petición GET:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function postData(url, data) {
    try {
        const authStore = useAuthStore();
        const response = await apiClient.post(url, data, {
            headers: {
                "x-token": authStore.getToken()
            }
        });
        return response.data
    } catch (error) {
        console.log('Error en la petición POST:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export async function putData(url, data) {
    try {
        const authStore = useAuthStore();
        const response = await apiClient.put(url, data, {
            headers: {
                "x-token": authStore.getToken()
            }
        });
        return response.data
    } catch (error) {
        console.error('Error en la petición PUT:', error)
        throw error;
    }
}