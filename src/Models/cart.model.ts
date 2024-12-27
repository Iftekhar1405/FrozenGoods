import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';
import { timestamp } from 'rxjs';

// Interface for cart items
interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Cart extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User | Types.ObjectId;

  @Prop([
    {
      product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      _id: false, // Disable automatic _id for subdocuments
    },
  ])
  items: CartItem[];

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalPrice: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalItems: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Add middleware to automatically calculate totals before saving
CartSchema.pre('save', async function (next) {
  const cart = this;

  // Calculate total items
  cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price
  // Note: You'll need to populate the products first if you want to calculate based on actual prices
  try {
    await cart.populate('items.product');
    cart.totalPrice = cart.items.reduce((sum, item) => {
      const product = item.product as unknown as Product;
      const price = parseFloat(product.price || product.MRP);
      return sum + price * item.quantity;
    }, 0);
  } catch (error) {
    next(error);
  }

  next();
});
