import { DatabaseService } from '../database/database.service';
export declare class HealthService {
    private readonly databaseService;
    private readonly logger;
    constructor(databaseService: DatabaseService);
    checkHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        nodeVersion: string;
    };
    checkDatabase(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
