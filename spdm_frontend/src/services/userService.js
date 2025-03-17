import api from "./api.js";

const BASE_API = "/api/user"

export async function getUserPage(data) {
    try {
        const response = await api.post(BASE_API + `/paging-user`, data);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Submit failed. Please try again!";
        console.log(errorMessage);
    }
}

export async function updateUser(data) {
    try {
        return await api.post(BASE_API + `/update-user`, data);
    } catch (error) {
        return error.response
    }
}
export async function resetPassword(data) {
    try {
        return await api.post(BASE_API + `/change-password`, data);
    } catch (error) {
        return error.response
    }
}