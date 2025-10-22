import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

export async function getCurrentUser(){
    try {
        const response = await api.get("/user/current")
        return response.data
    } catch (error) {
        console.error("Get current user error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}

export async function addNewAddress(addressData) {
    try {
        const response = await api.post("/user/address", addressData);
        return response.data;
    } catch (error) {
        console.error("Add address error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}
