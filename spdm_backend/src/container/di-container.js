/**
 * DIContainer is a simple dependency injection container.
 * It allows for registering and resolving services by name.
 */
class DIContainer {
    constructor() {
        this.services = new Map();
    }
  
    register(name, service) {
        this.services.set(name, service);
    }
  
    resolve(name) {
        return this.services.get(name);
    }
}

export default new DIContainer();