/**
 * Represents a user in the system.
 * 
 * @class User
 * @description This class is used to create a user object with essential properties.
 */
export class User {
    /**
     * Creates an instance of the User class.
     * 
     * @param {number} id - The unique identifier for the user.
     * @param {string} username - The username of the user.
     * @param {string} role - The role of the user.
     * @param {string} password - The password of the user.
     */
    constructor(id, username, role, password, token = null) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }
}