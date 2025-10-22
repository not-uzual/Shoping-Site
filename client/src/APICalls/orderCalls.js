import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export async function createOrder(orderData) {
    try {
        console.log('Sending order data:', JSON.stringify(orderData));
        const response = await api.post('/order', orderData);
        console.log('Order API response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Create order error:", error);
    }
}

export async function getUserOrders() {
    try {
        const response = await api.get('/order');
        return response.data;
    } catch (error) {
        console.error("Get orders error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to fetch orders. Please try again.");
        }
    }
}

export async function getOrderById(orderId) {
    try {
        const response = await api.get(`/order/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Get order error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to fetch order details. Please try again.");
        }
    }
}

export async function cancelOrder(orderId, reason) {
    try {
        const response = await api.put(`/order/${orderId}/cancel`, { reason });
        return response.data;
    } catch (error) {
        console.error("Cancel order error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to cancel order. Please try again.");
        }
    }
}

export async function getUserOrderStats() {
    try {
        const response = await api.get('/order/stats');
        return response.data;
    } catch (error) {
        console.error("Order stats error:", error);
        if (error.response && error.response.data) {
            throw error.response.data;
        } else {
            throw new Error("Failed to fetch order statistics. Please try again.");
        }
    }
}