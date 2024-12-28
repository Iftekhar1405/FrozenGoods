import {
  BadRequestException,
  Body,
  Controller,
  flatten,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { ClounidaryService } from 'src/common/clounidary/clounidary.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/Models/user.model';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly cloundinaryService: ClounidaryService,
  ) {}

  // Create a new product
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  // telling server to temporoary save the file in memeory
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  // init params
  async createProduct(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      // converting price to JSON Array/Object
      if (body.tags || typeof body.tags === 'string') {
        body.tags = JSON.parse(body.tags);
      }

      // addng image ul
      if (!file) {
        throw new BadRequestException("Can't Upload Without photo");
      }

      const imgUpload = await this.cloundinaryService.uploadImage(
        file,
        'PRODUCTS',
      );
      body.image = imgUpload.secure_url;

      // Create new DTO and overriding body in whole DTO by merging
      const createProductDTO = new CreateProductDto();
      Object.assign(createProductDTO, body);

      const product = this.productService.createProduct(createProductDTO);
      return product;
    } catch (error) {
      throw new BadRequestException(`Invalid Format: ${error.message}`);
    }
  }

  @Get()
  async getAllProducts() {
    const products = await this.productService.getAllProduct();
    return { products, totalProducts: products.length };
  }

  // Distinct Category

  @Get('Distinctcategory')
  async getDistinctCategory() {
    return this.productService.getDistictCategory();
  }

  @Get(':id')
  async getOneProduct(@Param('id') id: string) {
    console.log('leak');
    return this.productService.getOneProduct(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async updateProduct(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (body.tags) {
      body.tags = JSON.parse(body.tags);
    }

    if (file) {
      const uploadedImg = await this.cloundinaryService.uploadImage(
        file,
        'PRODUCTS',
      );
      body.image = uploadedImg.secure_url;
    }
    const updateProductDto = new UpdateProductDto();
    Object.assign(updateProductDto, body);

    return this.productService.updateProduct(id, updateProductDto);
  }
}
