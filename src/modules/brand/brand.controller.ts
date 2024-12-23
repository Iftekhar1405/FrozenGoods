import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { ClounidaryService } from 'src/common/clounidary/clounidary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/Models/user.model';
import { ExportContextSolution } from 'twilio/lib/rest/bulkexports/v1/export';

@Controller('products/brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly cloudinaryService: ClounidaryService,
  ) {}

  @Get('/')
  async getAllBrand() {
    return this.brandService.getAllBrand();
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async createBrand(
    @Body('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const uploadImage = await this.cloudinaryService.uploadImage(
        file,
        'BRANDS',
      );
      return this.brandService.createBrand(name, uploadImage.url);
    } catch (error) {
      throw new ExceptionsHandler(error);
    }
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
    }),
  )
  async updateBrand(
    @Param('id') id: string,
    @Body('name') name: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imageURL: string | null = null;

    // if imageTOUpdate
    if (file) {
      const uploadImage = await this.cloudinaryService.uploadImage(
        file,
        'BRANDS',
      );
      imageURL = uploadImage.url;
    }
    return this.brandService.updateBrand(id, name, imageURL);
  }
}
