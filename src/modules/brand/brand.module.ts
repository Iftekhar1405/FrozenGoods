import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from 'src/Models/brand.model';
import { ClounidaryService } from 'src/common/clounidary/clounidary.service';
import { ClounidaryModule } from 'src/common/clounidary/clounidary.module';

@Module({
  imports: [
    ClounidaryModule
,
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService,],
  exports: [BrandService],
})
export class BrandModule {}
