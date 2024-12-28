import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { Brand } from 'src/Models/brand.model';
import { Product } from 'src/Models/product.model';
import { CreateBrandDto } from '../brand/dto/create-brand.dto/create-brand.dto';
import { CreateProductDto } from './dto/create-product.dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto/update-product.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  //   Method to Create a new Product
  async createProduct(createProdcutDto: CreateProductDto): Promise<Product> {
    try {
      const isBrandAvailable = await this.brandModel.findById(
        createProdcutDto.brand,
      );
      if (!isBrandAvailable) {
        throw new HttpException('Brand does not exist', HttpStatus.BAD_REQUEST);
      }
      const newProdcut = new this.productModel(createProdcutDto);
      await newProdcut.save();

      return newProdcut;
    } catch (error) {
      throw new BadRequestException(
        `Something went wrong while uploading product, ${{ error: error.message }}`,
      );
    }
  }

  // Most important controller
  async getAllProduct(): Promise<Product[]> {
    try {
      const products = await this.productModel
        .find()
        .populate('brand', 'brandName')
        .exec();

      return products;
    } catch (error) {
      throw new BadRequestException(
        `Something went wrong while fetching products, ${{ error: error.message }}`,
      );
    }
  }

  // get Single Product
  async getOneProduct(id: string): Promise<Product> {
    try {
      const product = await this.productModel
        .findById(id)
        .populate('brand', 'brandName')
        .exec();
      if (!product)
        throw new NotFoundException(`No product found with id: ${id}`);

      return product;
    } catch (error) {
      throw new BadRequestException(
        `Some this wrong while fetching product detail, ${{ error: error.message }}`,
      );
    }
  }

  async updateProduct(id: string, updateProductDTO: UpdateProductDto) {
    try {
      const updatedProduct = await this.productModel.findOneAndUpdate(
        { _id: id },
        { $set: updateProductDTO },
        { new: true, runValidators: true, omitUndefined: true },
      );
      return updatedProduct;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new HttpException('Invalid user Id ', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        `Error updating user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDistictCategory(): Promise<Product> {
    const distinctCategory = await this.productModel.distinct('category');
    console.log(distinctCategory);
    return;
  }
}
