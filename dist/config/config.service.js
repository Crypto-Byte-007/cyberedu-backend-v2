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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get nodeEnv() {
        return this.configService.get('nodeEnv', 'development');
    }
    get port() {
        return this.configService.get('port', 3000);
    }
    get apiPrefix() {
        return this.configService.get('apiPrefix', '/api/v1');
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
    get database() {
        return {
            uri: this.configService.get('database.uri', 'mongodb://localhost:27017/cyberedu'),
            testUri: this.configService.get('database.testUri', 'mongodb://localhost:27017/cyberedu_test'),
        };
    }
    get jwt() {
        return {
            secret: this.configService.get('jwt.secret', 'change_this_in_production'),
            expiration: this.configService.get('jwt.expiration', '24h'),
        };
    }
    get logging() {
        return {
            level: this.configService.get('logging.level', 'info'),
            logToFile: this.configService.get('logging.logToFile', false),
        };
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=config.service.js.map