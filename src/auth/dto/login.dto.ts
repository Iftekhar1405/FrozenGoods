import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class LogInDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
