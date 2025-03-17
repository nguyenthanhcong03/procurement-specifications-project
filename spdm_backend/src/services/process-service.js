import { NodeLabelsEnums } from "../enums/enums.js";
import { HttpStatus } from "../enums/http-status-enums.js";
import { Helper } from "../helpers/helpers.js";
import { HttpException } from "../models/http-exception.js";

export class ProcessService {
    constructor (processRepository) {
        this.processRepository = processRepository;
    }

    /**
     * Checks if a process name exists.
     * 
     * @param {string} processName 
     * @returns {Promise<boolean>} - Returns true if the process name exists, false otherwise.
     */
    async isProcessExists(processName) {
        if (Helper.isEmptyString(processName)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, { errors: { processName: ["Process name is required"]}});
        }
        return this.processRepository.isProcessExists(processName);
    }

    /**
     * Creates a new process if it does not already exist.
     * 
     * @param {string} processName - The name of the process to create.
     * @param {number} isCreate - Flag indicating whether to create the process (1) or not (0).
     * @param {string} creatorId - The ID of the user creating the process.
     * @returns {Promise<any>} - Returns a promise that resolves to the created process node or undefined if not created.
     * @throws {HttpException} - Throws an exception if the process name already exists.
     */
    async createProcess (processName, isCreate, creatorId) {
        const session = this.processRepository.driver.session().beginTransaction();
        try {
            processName = processName.trim();
            
            if (isCreate == 0) {
                return;
            }
            
            if (await this.processRepository.isProcessExists(processName)) {
                throw new HttpException(HttpStatus.CONFLICT, { errors: { processName: ["Process name already exists"] } });
            }

            const result = await this.processRepository.createProcess(processName, creatorId);
            await session.commit();
            return result;
        } catch (e) {
            console.log(e);
            await session.rollback();
            throw e;
        } finally {
            await session.close();
        }
    }

    /**
     * Retrieves a paginated list of processes.
     *
     * @param {object} userPayload - The payload containing pagination parameters.
     * @param {number} userPayload.pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} userPayload.pageSize - The number of items per page.
     * @param {string} userPayload.search - The search term to filter the process names or creator names.
     * @returns {Promise<any>} - The paginated process data from the repository.
     */
    async pagingProcess(userPayload) { 
        let pageIndex = userPayload.pageIndex ?? 1;
        let pageSize = userPayload.pageSize ?? 10;
        let search = userPayload.search ?? '';
        let fromDate = userPayload.fromDate ?? '1970-01-01T00:00:00Z';
        let toDate = userPayload.toDate ?? '2099-01-01T00:00:00Z';
        
        return this.processRepository.pagingProcess(pageIndex, pageSize, search, fromDate, toDate);
    }
}