import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user-repository.js';
import { VersionRepository } from '../repositories/version-repository.js';
import { ProcessRepository } from '../repositories/process-repository.js';
import { AuthService } from '../services/auth-service.js';
import { VersionService } from '../services/version-service.js';
import { ProcessService } from '../services/process-service.js';
import {UserService} from "../services/user-service.js";
import { AuthController } from '../controllers/auth-controller.js';
import { VersionController } from '../controllers/version-controller.js';
import {UserController} from "../controllers/user-controller.js";
import { ProcessController } from '../controllers/process-controller.js';
import neo4j from 'neo4j-driver';
import diContainer from './di-container.js';
import { RolesEnums } from '../enums/enums.js';

export function registerServices() {
    // Create instances of services
    const neo4jDriver = neo4j.driver(
        process.env.NEO4J_URI || 'neo4j://localhost:7687',
        neo4j.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'password')
    );
    const userRepository = new UserRepository(neo4jDriver);
    const versionRepository = new VersionRepository(neo4jDriver);
    const processRepository = new ProcessRepository(neo4jDriver);
    const authService = new AuthService(userRepository);
    const versionService = new VersionService(versionRepository);
    const processService = new ProcessService(processRepository);
    const authController = new AuthController(authService);
    const versionController = new VersionController(versionService, processService);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
    const processController = new ProcessController(processService, versionService);


    // Register services to the DI container
    // // Repositories
    diContainer.register('userRepository', userRepository);
    diContainer.register('versionRepository', versionRepository);
    diContainer.register('processRepository', processRepository);
    // // Services
    diContainer.register('authService', authService);
    diContainer.register('versionService', versionService);
    diContainer.register('userService', userService);
    diContainer.register('processService', processService);
    // // Controllers
    diContainer.register('authController', authController);
    diContainer.register('versionController', versionController);
    diContainer.register('userController', userController);
    diContainer.register('processController', processController);

    // Seeding data
    seedingData(neo4jDriver);
}

async function seedingData(neo4jDriver) {
    const session = neo4jDriver.session();

    const password = process.env.DEFAULT_PASSWORD;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : '$2a$10$u/fbPJ1MPSueUoaOM6YM0e4gVY4RIhSz7fCJJMpefS2XBLn7dDBYG'; 
    
    const query = `
        MERGE (users:Users {name: 'Users'}) 
        MERGE (u:User {username: 'admin'})
        ON CREATE SET u.role = '${RolesEnums.ADMIN}', u.password = '${hashedPassword}'
        WITH u, users
        WHERE NOT (u)-[:_]->(users)
        CREATE (u)-[:_]->(users)
    `;

    session.run(query)
        .then(result => {
            console.log('Admin user created or already exists.');
        })
        .catch(error => {
            console.error('Error seeding admin user:', error);
        })
        .finally(() => {
            session.close();
        });
}