import {User} from "../models/user.js";
import {NodeLabelsEnums} from "../enums/enums.js";

export class UserRepository {
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Retrieves a user by their username.
     *
     * @async
     * @param {string} username - The username of the user to retrieve.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<User>} - A promise that resolves to the user object.
     */
    async getUserByUsername(username, session = this.driver.session()) {
        const query = `MATCH (u:User {username: $username}) RETURN u`;
        const params = {username};
        const result = await session.run(query, params);
        const singleRecord = result.records[0];
        if (singleRecord) {
            const node = singleRecord.get(0);
            return new User(node.elementId, node.properties.username, node.properties.role, node.properties.password);
        }
        return null;
    }

    /**
     * Saves a new user to the database.
     *
     * @async
     * @param {Object} user - The user object to save.
     * @param {string} user.username - The user's username.
     * @param {string} user.role - The user's role address.
     * @param {string} user.password - The user's hashed password.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<User>}
     */
    async saveUser(user, session = this.driver.session()) {
        const query = `
            MERGE (users:Users {name: 'Users'}) 
            CREATE (u:User {username: $username, role: $role, password: $password})
            CREATE (u)-[:_]->(users) 
            RETURN u`;
        const params = {
            username: user.username,
            role: user.role,
            password: user.password
        };
        const result = await session.run(query, params);
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);
        return new User(node.elementId, node.properties.username, node.properties.role, node.properties.password);
    }

    /**
     * Checks if a username is unique.
     *
     * @async
     * @param {string} username - The username to check for uniqueness.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<boolean>} - Returns true if the username is unique, false otherwise.
     */
    async isUsernameUnique(username, session = this.driver.session()) {
        const query = `
            MATCH (u:User {username: $username})
            RETURN u
        `;
        const params = {username};
        const result = await session.run(query, params);
        return result.records.length === 0;
    }

    /**
     * Retrieves a paginated list of users.
     *
     * @param {number} pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} pageSize - The number of items per page.
     * @returns {Promise<any>} - The paginated user data from the repository.
     */
    async pagingUser(pageIndex, pageSize, session = this.driver.session()) {
        try {
            // Query to get paginated data
            const cypherQuery = `MATCH (u:User) RETURN u SKIP ${(pageIndex - 1) * pageSize} LIMIT ${pageSize}`;
            const result = await session.run(cypherQuery);
            const records = result.records.map((record) => {
                return {
                    'id': record.get('u').elementId,
                    'role': record.get('u').properties.role,
                    'username': record.get('u').properties.username,
                };
            });
            // Query to get total number of records
            const countQuery = `MATCH (u:User) RETURN COUNT(u) AS totalRecords`;
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
     * Updates an existing user in the database.
     *
     * @param {User} user - The user object to update.
     * @param {Object} [session=this.driver.session()] - Optional database session.
     * @returns {Promise<User>} - The updated user object.
     */
    async updateUser(user, session = this.driver.session()) {
        const query = `
            MATCH (u:User {username: $username})
            SET u.password = $password, u.role = $role
            RETURN u
        `;
        const params = {
            username: user.username,
            password: user.password,
            role: user.role
        };
        const result = await session.run(query, params);
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);
        return new User(node.elementId, node.properties.username, node.properties.role, node.properties.password);
    }
}