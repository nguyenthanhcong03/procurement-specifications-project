import { action, makeAutoObservable } from "mobx";
import { getVersionPage } from "../services/versionService.js";
import { getVersionPageByProcessName } from "../services/processService.js";
import { HttpStatusCode } from "axios";
import { toast } from "react-toastify";

export default class VersionStore {
  page = {
    rows: [],
    totalPages: 0,
    totalRecords: 0,
    currentPage: 1,
    pageSize: 5,
  };
  search = {
    pageIndex: 1,
    pageSize: 10,
    search: null,
  };
  processName = null;

  constructor() {
    makeAutoObservable(this, {
      handePageChange: action,
      handleChangePagination: action,
      getVersionPage: action,
    });
  }

  getVersionPage = async (value) => {
    try {
      const response = await getVersionPage(value); // Replace with your API call function
      if (response?.data) {
        const { records, totalPages, totalRecords } = response.data;
        this.page = {
          rows: records,
          totalPages,
          totalRecords,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  getVersionPageByProcess = async (search, processName) => {
    try {
      const response = await getVersionPageByProcessName(search, processName); // Replace with your API call function
      if (response?.status === HttpStatusCode.Ok) {
        const { records, totalPages, totalRecords } = response.data.data;
        this.page = {
          rows: records,
          totalPages,
          totalRecords,
        };
        console.log("page", this.page);
      } else {
        toast.error("Error getting version page");
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleChangePagination = async (updater) => {
    let pagination = {
      pageIndex: 1,
      pageSize: 10,
    };
    if (typeof updater === "function") {
      pagination = updater(pagination);
    } else {
      pagination = updater;
    }
    this.search = {
      pageIndex: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };
    await this.getVersionPage();
  };

  setProcessName = (processName) => {
    this.processName = processName;
  };
}
