import { NodeLabelsEnums, RelationTypesEnums } from "../enums/enums.js";

export class ProcessRepository {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Checks if a process name is exists.
     * 
     * @async
     * @param {string} processName - The process name to check.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<boolean>} - Returns true if the process name is exists, false otherwise.
     */
    async isProcessExists(processName, session = this.driver.session()) {
        const query = `
            MATCH (n:${NodeLabelsEnums.PROCESS} {processName: '${processName}'})
            RETURN n
        `;
        const params = { processName };
        const result = await session.run(query, params);
        return result.records.length > 0;
    }

    /**
     * Creates a new process node in the Neo4j database.
     * 
     * @param {string} processName - The name of the process to create.
     * @param {string} creatorId - The ID of the user creating the process.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>} - Returns a promise that resolves to the created process node.
     */
    async createProcess(processName, creatorId, session = this.driver.session()) {
        const createdAt = new Date().toISOString();
        const query = `
            MERGE (processes:Processes {name: 'Processes'})
            CREATE (p:${NodeLabelsEnums.PROCESS} {processName: '${processName}', creatorId: '${creatorId}', createdAt: '${createdAt}'})
            CREATE (p)-[:_]->(processes) 
            RETURN p`;
        const result = await session.run(query);
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);

        // assign to creator
        const assignQuery = `
            MATCH (process:${NodeLabelsEnums.PROCESS} {processName: '${processName}'}) 
            MATCH (user:${NodeLabelsEnums.USER}) WHERE elementId(user) = '${creatorId}'
            CREATE (process)-[:${RelationTypesEnums.CREATED_BY}]->(user)`;
        await session.run(assignQuery);

        return node;
    }

    /**
     * Retrieves a paginated list of processes.
     *
     * @param {number} pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} pageSize - The number of items per page.
     * @param {string} search - The search term to filter the process names or creator names.
     * @param {string} fromDate - The start date to filter the process creation date.
     * @param {string} toDate - The end date to filter the process creation date.
     * @param {Object} [session=this.driver.session()] - The Neo4j session to use for the query.
     * @returns {Promise<any>} - The paginated process data from the repository.
     */
    async pagingProcess(pageIndex, pageSize, search, fromDate, toDate, session = this.driver.session()){
        try {
          // Query to get paginated data
          let query = `MATCH (p:${NodeLabelsEnums.PROCESS})-[:CREATED_BY]->(u:User) WHERE 1=1 `;

          // Add search filter
          if (search) {
            query += `AND u.username CONTAINS '${search}' or p.processName CONTAINS '${search}' `;
          }

          if (fromDate) {
            query += `AND datetime(COALESCE(p.createdAt, "1970-01-01T00:00:00Z")) >= datetime('${fromDate}') `;
          }

          if (toDate) {
            query += `AND datetime(COALESCE(p.createdAt, "1970-01-01T00:00:00Z")) <= datetime('${toDate}') `;
          }

          const cypherQuery = `
              ${query} RETURN elementId(p) as id, p, u.username as createdBy
              ORDER BY datetime(COALESCE(p.createdAt, "1970-01-01T00:00:00Z")) DESC 
              SKIP ${(pageIndex - 1) * pageSize} LIMIT ${pageSize}`;
          const result = await session.run(cypherQuery);
          const records = result.records.map((record) => {
            return {
              'id': record.get('id'),
              'data': record.get('p').properties,
              'createdBy': record.get('createdBy'),
            };
          });    
      
          // Query to get total number of records
          const countQuery = `${query} RETURN COUNT(p) AS totalRecords`;
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
}