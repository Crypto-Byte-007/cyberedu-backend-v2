import { Strategy } from 'passport-jwt';
import { AppConfigService } from '../../config/config.service';
import { JwtPayload } from '../interfaces/tokens.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: AppConfigService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        role: import("../../users/schemas/user.schema").UserRole;
        firstName: string;
        lastName: string;
    }>;
}
export {};
