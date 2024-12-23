import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { deepEqual } from 'assert';
import { Document, Types } from 'mongoose';
import { Brand } from './brand.model';
import { Category } from './category.model';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Product extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Brand | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Category | Types.ObjectId;

  @Prop({ required: true, trim: true })
  MRP: string;

  @Prop({ trim: true })
  price: string;

  @Prop({ default: false })
  isFavorite: boolean;

  @Prop({
    required: true,
    message: 'Please provide the image',
  })
  image: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
