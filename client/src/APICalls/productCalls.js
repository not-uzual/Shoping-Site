import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

export async function getAllProducts(page, limit){
    try {
        const response = await api.get(`product/fetchall?limit=${limit}&&offset=${(page-1)*limit}`)
        return response.data
    } 
    catch (error) {
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

export async function addToWishlist(productId) {
    try {
        const response = await api.post(`product/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Add to wishlist error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}

export async function removeFromWishlist(productId) {
    try {
        const response = await api.delete(`product/wishlist/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Remove from wishlist error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}

export async function getWishlist() {
    try {
        const response = await api.get('product/wishlist');
        return response.data;
    } catch (error) {
        console.error("Get wishlist error:");
        
        if (error.response && error.response.data) {
            throw error.response.data;
        } 
        else {
            throw new Error("Network error or server not responding");
        }
    }
}