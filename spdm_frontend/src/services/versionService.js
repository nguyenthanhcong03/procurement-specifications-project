import api from "./api.js";

const BASE_API = "/api/versions"

export async function getVersionPage(data) {
    try {
        const response = await api.post(BASE_API + `/paging-version`, data);
        return response.data;
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Submit failed. Please try again!";
        console.log(errorMessage);
    }
}
export async function uploadFile(fromData) {
    try {
        const bodyFormData = new FormData();
        fromData.files.forEach((file) => {
            bodyFormData.append('files', file);
        })
        bodyFormData.append('processName', fromData.processName);
        bodyFormData.append('isCreate', fromData.isCreate);
        return await api.post(
            BASE_API + `/upload`,
            bodyFormData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Custom header for this specific request
                }
            }
        );
    } catch (error) {
        return error.response
    }
}