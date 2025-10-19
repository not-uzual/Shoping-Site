import axios from "axios";
import { API_BASE_URL } from "./config";


const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});


export async function getCart() {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        console.error("Get cart error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to retrieve cart. Please try again.");
        }
    }
}


export async function addToCart(productId, quantity = 1) {
    try {
        const response = await api.post('/cart/add', { productId, quantity });
        return response.data;
    } catch (error) {
        console.error("Add to cart error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to add item to cart. Please try again.");
        }
    }
}


export async function updateCartItemQuantity(productId, quantity) {
    try {
        const response = await api.put(`/cart/update/${productId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error("Update cart error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to update cart. Please try again.");
        }
    }
}


export async function removeFromCart(productId) {
    try {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    } catch (error) {
        console.error("Remove from cart error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to remove item from cart. Please try again.");
        }
    }
}


export async function applyCoupon(couponCode) {
    try {
        const response = await api.post('/cart/coupon', { couponCode });
        return response.data;
    } catch (error) {
        console.error("Apply coupon error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to apply coupon. Please try again.");
        }
    }
}


export async function removeCoupon() {
    try {
        const response = await api.delete('/cart/coupon');
        return response.data;
    } catch (error) {
        console.error("Remove coupon error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to remove coupon. Please try again.");
        }
    }
}