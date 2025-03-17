import bcrypt from 'bcryptjs';
import { HttpException } from '../models/http-exception.js';
import { HttpStatus } from '../enums/http-status-enums.js';
import { RolesEnums } from '../enums/enums.js';

export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a paginated list of users.
     *
     * @param {object} userPayload - The payload containing pagination parameters.
     * @param {number} userPayload.pageIndex - The current page index (starting from 0 or 1, depending on implementation).
     * @param {number} userPayload.pageSize - The number of items per page.
     * @returns {Promise<any>} - The paginated user data from the repository.
     */
    async pagingUser(userPayload) {
        let pageIndex = userPayload.pageIndex ?? 1;
        let pageSize = userPayload.pageSize ?? 10;
        return this.userRepository.pagingUser(pageIndex, pageSize);
    }

    /**
     * Resets a user's password.
     * 
     * @param {object} userPayload - The payload containing the user data to reset the password.
     * @param {string} userPayload.username - The user's username.
     * @param {string} userPayload.password - The user's new password.
     * @returns {Promise<void>}
     */
    async resetPassword (userPayload) {
        const username = userPayload.username?.trim();
        const password = userPayload.password?.trim();

        // find user by username
        const user = await this.userRepository.getUserByUsername(username);
        
        if (user) {
            const newHashedPassword = await bcrypt.hash(password, 10);
            user.password = newHashedPassword;
            return await this.userRepository.updateUser(user);
        }
        throw new HttpException(HttpStatus.FORBIDDEN, {
            errors: {
            'username': ['is invalid'],
            },
        });
    }

    /**
     * Update user infomation.
     * 
     * @param {object} userPayload - The payload containing the user data.
     * @param {string} userPayload.username - The user's username.
     * @param {string} userPayload.password - The user's new password.
     * @param {string} userPayload.role - The user's role.
     * @returns {Promise<void>}
     */
    async updateUser (userPayload) {
        const username = userPayload.username?.trim();
        const password = userPayload.password?.trim();
        const role = userPayload.role?.trim();

        // find user by username
        const user = await this.userRepository.getUserByUsername(username);
        
        if (user && (password || role)) {
            if (password) {
                const newHashedPassword = await bcrypt.hash(password, 10);
                user.password = newHashedPassword;
            }
            if (role && [RolesEnums.ADMIN, RolesEnums.USER].includes(role)) {
                user.role = role;
            }
            return await this.userRepository.updateUser(user);
        }
        throw new HttpException(HttpStatus.FORBIDDEN, {
            errors: 'Data is invalid',
        });
    }

    /**
     * Changes a user's password.
     * 
     * @param {object} userPayload - The payload containing the user data to change the password.
     * @param {string} userPayload.username - The user's username.
     * @param {string} userPayload.password - The user's new password.
     * @returns {Promise<void>}
     */
    async changePassword(userPayload) {
        const username = userPayload.username?.trim();
        const password = userPayload.password?.trim();
        const newPassword = userPayload.newPassword?.trim();

        // find user by username
        const user = await this.userRepository.getUserByUsername(username);
        
        if (user) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const newHashedPassword = await bcrypt.hash(newPassword, 10);
                user.password = newHashedPassword;
                return await this.userRepository.updateUser(user);
            }
        }
        throw new HttpException(HttpStatus.FORBIDDEN, {
            errors: {
            'username or password': ['is invalid'],
            },
        });
    }
}
