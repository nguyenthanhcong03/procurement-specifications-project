import api from "./api.js";

const BASE_API = "/api/processes"

export async function getProcessPage(data) {
    try {
        return await api.post(BASE_API + `/paging-process`, data);
    } catch (error) {
        return error.response
    }
}

export async function getLastVersionByProcessName(processName) {
    try {
        return await api.get(BASE_API + `/${processName}/latest-version`);
    } catch (error) {
        return error.response
    }
}

export async function getVersionPageByProcessName(data,processName) {
    try {
        return await api.post(BASE_API + `/${processName}/paging-version`, data);
    } catch (error) {
        return error.response
    }
}
