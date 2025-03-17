import api from "./api.js";

const BASE_API = "/api/versions"
const BASE_API_PV = "/api/processes"

export async function saveNewVersion(data) {
    try {
        return await api.post(BASE_API, data);
    } catch (error) {
        return error.response;
    }
}

export async function updateVersion(data) {
    try {
        return await api.put(BASE_API, data);
    } catch (error) {
        return error.response
    }
}

export async function getProgramByVersionName(versionName) {
    try {
        const response = await api.get(BASE_API + `/${versionName}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Submit failed. Please try again!";
        console.log(errorMessage);
    }
}

export async function getProgramByProcessVersionName(processName, versionName) {
    try {
        return await api.get(BASE_API_PV + `/${processName}` + `/versions/${versionName}`);
    } catch (error) {
        return error.response
    }
}
