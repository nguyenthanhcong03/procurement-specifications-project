import {makeAutoObservable} from "mobx";
import {getUserPage, resetPassword, updateUser} from "../services/userService.js";
import {HttpStatusCode} from "axios";
import {toast} from "react-toastify";

export default class UserStore {
    isChangePassword = false;
    isResetPassword = false;
    page = {
        rows: [], totalPages: 0, totalRecords: 0,
    }
    search = {
        pageIndex: 1, pageSize: 10,
    }
    user = null

    constructor() {
        makeAutoObservable(this);
    }

    resetStore() {
        this.isChangePassword = false;
        this.page = {
            rows: [], totalPages: 0, totalRecords: 0,
        }
        this.search = {
            pageIndex: 1, pageSize: 10,
        }
        this.user = null
    }

    setUser = (user) => {
        this.user = user;
    }

    handleChangePagination = async (updater) => {
        let pagination = {
            pageIndex: 1, pageSize: 10
        }
        if (typeof updater === 'function') {
            pagination = updater(pagination);
        } else {
            pagination = updater;
        }
        this.search = {
            pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize
        }
        await this.getUserPage(this.search)

    };
    getUserPage = async (value) => {
        try {
            const response = await getUserPage(value); // Replace with your API call function
            if (response?.data) {
                const {records, totalPages, totalRecords} = response.data
                this.page = {
                    rows: records, totalPages, totalRecords
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleChangePasswordStatus = () => {
        this.isChangePassword = !this.isChangePassword;
    }
    handleResetPasswordStatus = () => {
        this.isResetPassword = !this.isResetPassword;
    }
    handleChangePassword = async (value) => {
        const response = await updateUser(value);
        if (response.status === HttpStatusCode.Ok) {
            toast.success("Update user successfully");
            this.resetStore();
            await this.getUserPage(this.search)
        } else {
            toast.error("Something went wrong");
        }
    }
    handleResetPassword = async (value) => {
        const response = await resetPassword(value);
        if (response.status === HttpStatusCode.Ok) {
            toast.success("Change password successfully");
        } else {
            toast.error("Something went wrong");
        }
    }
}
