export class DIContainer {
    private static instance: DIContainer;
    private dependencies: Map<string, any> = new Map();

    private constructor() { }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    register<T>(name: string, dependency: T): void {
        this.dependencies.set(name, dependency);
    }

    resolve<T>(name: string): T {
        const dependency = this.dependencies.get(name);
        if (!dependency) {
            throw new Error(`Dependency ${name} not found`);
        }
        return dependency;
    }
}
