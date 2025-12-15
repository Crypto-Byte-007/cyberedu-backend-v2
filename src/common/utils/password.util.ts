import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(
    plainText: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedPassword);
  }

  static validateStrength(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}