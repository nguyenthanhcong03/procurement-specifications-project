import bcrypt from 'bcryptjs';
import { HttpException } from '../models/http-exception.js';
import { Helper } from '../helpers/helpers.js';
import { HttpStatus } from '../enums/http-status-enums.js';
import { RolesEnums } from '../enums/enums.js';

export class AuthService {
    constructor (userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Authenticates a user based on the provided user payload (username and password).
     * 
     * @async
     * @param {Object} userPayload - The user data containing the username and password to authenticate.
     * @param {string} userPayload.username - The user's username.
     * @param {string} userPayload.password - The user's password.
     * @returns {Promise<Object>} - A promise that resolves to an object containing the user's username, role, and a generated authentication token.
     * @throws {HttpException} - Throws an exception if username or password is missing, or if authentication fails.
     */
    async login (userPayload) {
        const username = userPayload.username?.trim();
        const password = userPayload.password?.trim();

        // find user by username
        const user = await this.userRepository.getUserByUsername(username);

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
            return {
                username: user.username,
                role: user.role,
                token: Helper.generateToken(user),
            };
            }
        }

        throw new HttpException(HttpStatus.FORBIDDEN, {
            errors: {
            'username or password': ['is invalid'],
            },
        });
    }

    /**
     * Registers a new user with the provided user payload (username, password and role).
     * 
     * @async
     * @param {Object} userPayload - The user data containing the username, password and role to register.
     * @param {string} userPayload.username - The user's username.
     * @param {string} userPayload.password - The user's password.
     * @param {string} userPayload.role - The user's role address.
     * @returns {Promise<Object>} - A promise that resolves to an object containing the user's role, username, and a generated authentication token.
     * @throws {HttpException} - Throws an exception if username, role, or password is missing, or if registration fails.
     */
    async register(userPayload) {
        const session = this.userRepository.driver.session().beginTransaction();
        try {

            const username = userPayload.username?.trim();
            const role = userPayload.role?.trim();
            const password = userPayload.password?.trim();

            // Check if the username already exists
            const isUnique = await this.userRepository.isUsernameUnique(username);
            if (!isUnique) {
                throw new HttpException(HttpStatus.CONFLICT, { errors: { username: ["Username already exists"] } });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = {
                username,
                role,
                password: hashedPassword
            };

            // Save the new user to the repository
            const savedUser = await this.userRepository.saveUser(newUser, session);
            const userToken = Helper.generateToken(savedUser);
            await session.commit();

            return {
                ...savedUser,
                token: userToken,
            };
        } catch (e) {
            console.log(e);
            await session.rollback();
            throw e;
        } finally {
            await session.close();
        }
    }
}