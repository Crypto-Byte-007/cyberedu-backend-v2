import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
