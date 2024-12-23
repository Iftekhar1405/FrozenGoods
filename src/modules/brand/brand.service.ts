import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/Models/brand.model';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) { }

  async getAllBrand() {
    const brands = await this.brandModel.find();
    if (!brands || brands.length === 0) {
      throw new NotFoundException('No brand found');
    }
    return brands;
  }

  async createBrand(brandName: string, imgURL: string): Promise<Brand> {
    const newBrand = new this.brandModel({ brandName: brandName, img: imgURL });
    return newBrand.save();
  }

  async updateBrand(
    id: string,
    name: string,
    imageURL: string | null,
  ): Promise<Brand> {
    const brand = await this.brandModel.findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand with this id: ${id} is not avaliable`);
    }

    if (name) {
      brand.brandName = name;
    }

    if (imageURL) {
      brand.img = imageURL;
    }

    await brand.save();
    return brand;
  }
}
