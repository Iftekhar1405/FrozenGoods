import { IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { UserRole } from '../models/user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
