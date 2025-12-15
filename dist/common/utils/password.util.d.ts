export declare class PasswordUtil {
    private static readonly SALT_ROUNDS;
    static hash(password: string): Promise<string>;
    static compare(plainText: string, hashedPassword: string): Promise<boolean>;
    static validateStrength(password: string): boolean;
}
