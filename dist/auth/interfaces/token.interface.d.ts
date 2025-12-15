export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
}
export interface RequestWithUser extends Request {
    user: JwtPayload & {
        id: string;
        refreshToken?: string;
    };
}
