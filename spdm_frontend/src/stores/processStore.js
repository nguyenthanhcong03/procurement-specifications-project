import {makeAutoObservable} from "mobx";
import {getProcessPage} from "../services/processService.js";
import {toast} from "react-toastify";
import {HttpStatusCode} from "axios";

export default class ProcessStore {
    isPopupVersionListOpen = false
    page = {
        rows: [],
        totalPages: 0,
        totalRecords: 0,
        currentPage: 1,
        pageSize: 5,
    }
    search = {
        search: null,
        pageIndex: 1,
        pageSize: 10,
        fromDate: null,
        toDate: null
    }

    constructor() {
        makeAutoObservable(this);

    }

    changeStatusPopupVersionList = () => {
        this.isPopupVersionListOpen = !this.isPopupVersionListOpen;
    }

    getProcessPage = async (search) => {
        const response = await getProcessPage(search);
        if (response.status === HttpStatusCode.Ok) {
            if (response?.data) {
                const {records, totalPages, totalRecords} = response.data.data
                this.page = {
                    rows: records,
                    totalPages,
                    totalRecords
                }
            }
        } else if (response.status === HttpStatusCode.BadRequest) {
            toast.error('Error');
        } else {
            toast.error('Error');
        }
    }

    handleChangePagination = async (updater) => {
        let pagination = {
            pageIndex: 1,
            pageSize: 10
        }
        if (typeof updater === 'function') {
            pagination = updater(pagination);
        } else {
            pagination = updater;
        }
        this.search = {
            pageIndex: pagination.pageIndex + 1,
            pageSize: pagination.pageSize
        }
        await this.getProcessPage();
    };

}