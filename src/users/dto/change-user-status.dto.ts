import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserStatus } from '../schemas/user.schema';

export class ChangeUserStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
