import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection } from 'mongoose';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private readonly connection;
    private readonly logger;
    constructor(connection: Connection);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    getConnection(): Connection;
    checkConnection(): Promise<boolean>;
}
