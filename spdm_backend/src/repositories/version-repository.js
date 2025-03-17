import { NodeLabelsEnums, RelationTypesEnums } from "../enums/enums.js";
import { HttpStatus } from "../enums/http-status-enums.js";
import { HttpException } from "../models/http-exception.js";

export class VersionRepository {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Checks if a version name is exists.
     * 
     * @async
     * @param {string} versionName - The version name to check.
     * @param {string} processName - The process name of version.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<boolean>} - Returns true if the version name is exists, false otherwise.
     */
    async isVersionExists(versionName, processName, session = this.driver.session()) {
        const query = `
            MATCH (n:${NodeLabelsEnums.LABEL1} {versionName: '${versionName}', processName: '${processName}'})
            RETURN n
        `;
        const params = { versionName };
        const result = await session.run(query, params);
        return result.records.length > 0;
    }

    /**
     * Save new version data.
     * 
     * @param {Array} nodeElements 
     * @param {Array} edgeElements 
     * @param {string} currentUsername
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<boolean>}
     */
    async saveNewVersion(nodeElements, edgeElements, currentUsername, session = this.driver.session()) {
        let query = "";
        const createdAt = new Date().toISOString();

        if (nodeElements.length > 0) {
            const processName = nodeElements[0]['properties']['processName'];
            const versionName = nodeElements[0]['properties']['versionName'];
            if (await this.isVersionExists(versionName, processName)) {
                throw new HttpException(HttpStatus.CONFLICT, { errors: { versionName: ["Version name already exists"] } });
            }
            query += `MATCH (process:${NodeLabelsEnums.PROCESS} {processName: '${processName}'}) \n`;
            query += `MATCH (user:${NodeLabelsEnums.USER} {username: '${currentUsername}'}) \n`;
        }

        nodeElements.forEach(element => {
            element['properties'] = { ...element['properties'], createdAt };
            query += `CREATE (${element['id']}:${element['label']} ${this.#getNodeDataAsString(element['properties'])}) \n`;
            if (element['label'] === NodeLabelsEnums.LABEL1) {
                query += `CREATE (${element['id']})-[:_]->(process) \n`;
                query += `CREATE (${element['id']})-[:${RelationTypesEnums.CREATED_BY}]->(user) \n`;
            }
        });

        edgeElements.forEach(element => {
            query += `CREATE (${element['source']})-[:${element['label']} ${this.#getNodeDataAsString(element['properties'])}]->(${element['target']}) \n`;
        });

        await session.run(query);
        return true;
    }

    /**
     * Deletes all nodes with the specified version name from the database.
     *
     * @param {string} versionName - The name of the version to delete.
     * @param {string} processName - The name of the process.
     * @param {object} session - (Optional) The Neo4j session to use for the query. Defaults to `this.driver.session()`.
     * @returns {Promise<boolean>} - Returns `true` after successful deletion.
     */
    async deleteVersionData(versionName, processName, session = this.driver.session()) {
        const query = `
            MATCH (n{versionName: '${versionName}', processName: '${processName}'})
            DETACH DELETE n
        `;
        const params = { versionName };
        await session.run(query, params);
        return true;
    }

    /**
     * Retrieves a paginated list of versions of selected process.
     *
     * @param {string} processName - The name of the process.
     * @param {number} pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} pageSize - The number of items per page.
     * @param {string} search - The search term to filter the version names or creator names.
     * @param {string} fromDate - The start date to filter the process creation date.
     * @param {string} toDate - The end date to filter the process creation date.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>} - The paginated version data from the repository.
     */
    async pagingProcessVersion(processName, pageIndex, pageSize, search, fromDate, toDate, session = this.driver.session()){
        try {
            let query = `MATCH (v:${NodeLabelsEnums.LABEL1} {processName: '${processName}'})-[:CREATED_BY]->(u:User) WHERE 1=1 `;

            // Add search filter
            if (search) {
                query += `AND u.username CONTAINS '${search}' or v.versionName CONTAINS '${search}' `;
            }

            if (fromDate) {
                query += `AND datetime(COALESCE(v.createdAt, "1970-01-01T00:00:00Z")) >= datetime('${fromDate}') `;
              }
    
            if (toDate) {
                query += `AND datetime(COALESCE(v.createdAt, "1970-01-01T00:00:00Z")) <= datetime('${toDate}') `;
            }

            // Query to get paginated data
            const cypherQuery = `
                ${query} RETURN elementId(v) as id, v, u.username as createdBy 
                ORDER BY datetime(COALESCE(v.createdAt, "1970-01-01T00:00:00Z")) DESC 
                SKIP ${(pageIndex - 1) * pageSize} LIMIT ${pageSize}`;
            const result = await session.run(cypherQuery);
            const records = result.records.map((record) => {
                return {
                    'id': record.get('id'),
                    'data': record.get('v').properties,
                    'createdBy': record.get('createdBy'),
                };
            });    
        
            // Query to get total number of records
            const countQuery = `${query} RETURN COUNT(v) AS totalRecords`;
            const countResult = await session.run(countQuery);
            const totalRecords = countResult.records[0].get('totalRecords').toNumber();
        
            // Calculate total pages
            const totalPages = Math.ceil(totalRecords / pageSize);
        
            return {
                'records': records,
                'currentPage': pageIndex,
                'pageSize': pageSize,
                'totalPages': totalPages,
                'totalRecords': totalRecords
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    /**
     * Retrieves all data for of the version by process.
     *
     * @param {string} processName - The name of the process.
     * @param {object} session - (Optional) The Neo4j session to use for the query. Defaults to `this.driver.session()`.
     * @returns {Promise<any>} - Returns the version data object.
     */
    async getLatestVersionOfProcess(processName, session = this.driver.session()) {
        const versionNameQuery = await session.run(`
                MATCH (n: ${NodeLabelsEnums.LABEL1} {processName: '${processName}'}) 
                RETURN n.versionName as versionName
                ORDER BY datetime(COALESCE(n.createdAt, "1970-01-01T00:00:00Z")) DESC 
                LIMIT 1
            `);
        const versionName = versionNameQuery.records[0].get('versionName');
        return await this.getVersionOfProcess(processName, versionName, session);
    }

    /**
     * Retrieves all data for of the version by process name and version name.
     *
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {object} session - (Optional) The Neo4j session to use for the query. Defaults to `this.driver.session()`.
     * @returns {Promise<any>} - Returns the version data object.
     */
    async getVersionOfProcess(processName, versionName, session = this.driver.session()) {
        // Add nodes
        const nodeQuery = `MATCH (n{versionName: '${versionName}', processName: '${processName}'}) RETURN n`;
        const nodeResult = await session.run(nodeQuery);
        
        // Add edges
        const edgeQuery = `MATCH ()-[r{versionName: '${versionName}', processName: '${processName}'}]->() RETURN r`;
        const edgeResult = await session.run(edgeQuery);

        return {
            'elements': nodeResult,
            'edges': edgeResult,
        };
    }

    /**
     * Assigns a creator to the specified process version.
     * 
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {string} creatorId - The ID of the user creating the process.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<boolean>} - Returns `true` after successful assignment.
     */
    async assignCreator(processName, versionName, creatorId, session = this.driver.session()) {
        const query = `
            MATCH (n:${NodeLabelsEnums.LABEL1} {processName: '${processName}', versionName: '${versionName}'})
            MATCH (u:${NodeLabelsEnums.USER} {userId: '${creatorId}'})
            CREATE (n)-[:${RelationTypesEnums.CREATED_BY}]->(u)
        `;
        
        await session.run(query);
        return true;
    }

    /**
     * Get input list of file.
     * 
     * @param {string} fileName - The name of the file.
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>}
     */
    async getFileNodeInputs(fileName, processName, versionName, session = this.driver.session()) {
        const query = `
            MATCH (input)-[]->(n:${NodeLabelsEnums.LABEL3} {sublabel: '${fileName}', processName: '${processName}', versionName: '${versionName}'})
            return input
        `;
        
        return await session.run(query);
    }

    /**
     * Save single result to node.
     * 
     * @param {string} fileName - The name of the file.
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {any} value
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>}
     */
    async saveSingleResultFileValue(fileName, processName, versionName, value, session = this.driver.session()) {
        const query = `
            MATCH (n:${NodeLabelsEnums.LABEL3} {sublabel: '${fileName}', processName: '${processName}', versionName: '${versionName}'})-[]->(rs)
            SET rs.key2 = ${value}
        `;
        
        return await session.run(query);
    }
    
    /**
     * Get version execute list.
     * 
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>}
     */
    async getExecuteList(processName, versionName, session = this.driver.session()) {
        const query = `
            MATCH (n1)-[r:Type2 {processName: '${processName}', versionName: '${versionName}'}]->(n2) 
            RETURN DISTINCT n1.sublabel as from, n2.sublabel as to
        `;
        return await session.run(query);

    }

    /**
     * Save version execute list.
     * 
     * @param {string} fileName - The name of the file.
     * @param {string} processName - The name of the process.
     * @param {string} versionName - The name of the version.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>}
     */
    async setDependencyValue(fileName, processName, versionName, session = this.driver.session()) {
        const query = `
            MATCH (n1)-[r:Type2 {processName: '${processName}', versionName: '${versionName}'}]->(n2) 
            WHERE n1.sublabel = '${fileName}' 
            SET n2.key2 = n1.key2
        `;
        return await session.run(query);

    }

    /**
     * Converts an object into a formatted string representation.
     * 
     * @param {Object} data - The object to be converted. Keys and values will be used to construct the string.
     * @returns {string} - A string in the format "{key1: 'value1', key2: 'value2'}".
     */
    #getNodeDataAsString(data) {
        // return '{key1: 'var1', key2: 'm'}'
        const entries = Object.entries(data ?? {}).map(([key, value]) => {
            return `${key}: '${value}'`;
        });
        return `{${entries.join(', ')}}`;
    }
}