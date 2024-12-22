import {
  IsString,
  IsBoolean,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string; // Brand ID

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  MRP: string;

  @IsString()
  @IsOptional()
  price?: string;

  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @IsString()
  @IsOptional()
  image?: string; // URL of the uploaded image

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
