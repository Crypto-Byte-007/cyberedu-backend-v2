"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let DatabaseService = DatabaseService_1 = class DatabaseService {
    constructor(connection) {
        this.connection = connection;
        this.logger = new common_1.Logger(DatabaseService_1.name);
    }
    async onModuleInit() {
        try {
            if (this.connection.db) {
                await this.connection.db.admin().ping();
                this.logger.log('✅ MongoDB connected successfully');
                this.logger.log(`📊 Database name: ${this.connection.db.databaseName}`);
            }
            else {
                this.logger.error('❌ MongoDB connection not established');
            }
        }
        catch (error) {
            this.logger.error('❌ Failed to connect to MongoDB', error.stack);
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.connection.close();
            this.logger.log('MongoDB connection closed');
        }
        catch (error) {
            this.logger.error('Error closing MongoDB connection', error.stack);
        }
    }
    getConnection() {
        return this.connection;
    }
    async checkConnection() {
        try {
            if (this.connection.db) {
                await this.connection.db.admin().ping();
                return true;
            }
            return false;
        }
        catch {
            return false;
        }
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = DatabaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], DatabaseService);
//# sourceMappingURL=database.service.js.map