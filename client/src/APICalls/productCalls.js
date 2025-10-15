import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

export async function getAllProducts(){
    try {
        const response = await api.get('product/fetchall')
        return response.data
    } catch (error) {
        console.error("Get all product error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}

export async function getSingleProduct(id) {
    try {
        const response = await api.get(`product/fetch/${id}`)
        return response.data
    } catch (error) {
        console.error("Get single product error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}