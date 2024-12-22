import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsPhoneNumber,
} from 'class-validator';
import { UserRole } from 'src/Models/user.model';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Invalid phone number format' })
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be either "user" or "admin"' })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
