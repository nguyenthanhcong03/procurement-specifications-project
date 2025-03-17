import api from "./api.js";

const BASE_API = "/api"

export async function login(data) {
    try {
        const response = await api.post(BASE_API + "/login", data);
        // Save token to localStorage
        sessionStorage.setItem("currentUser", JSON.stringify(response?.data?.data));
        return response;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Login failed. Please try again.";
        console.log(errorMessage);
    }
}

export async function register(data) {
    try {
        return await api.post(BASE_API + "/register", data);
    } catch (error) {
        return error.response
    }
}

export function logout() {
    sessionStorage.removeItem("currentUser");
}
