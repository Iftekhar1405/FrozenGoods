import {
    IsString,
    IsBoolean,
    IsArray,
    IsNotEmpty,
    ValidateNested,
    IsOptional,
   } from 'class-validator';
   import { Type } from 'class-transformer';
   
   export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;
   
    @IsString()
    @IsOptional()
    brand?: string; // Brand ID
   
    @IsString()
    @IsOptional()
    category?: string;
   
    @IsString()
    @IsOptional()
    MRP?: string;
   
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