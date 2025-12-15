import { UserRole } from '../../users/schemas/user.schema';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}
