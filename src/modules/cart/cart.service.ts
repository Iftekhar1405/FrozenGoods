import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from 'src/Models/cart.model';
import { Product } from 'src/Models/product.model';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  addTOCart = async (userId: string, productId: string, quantity: number) => {
    const productObjectId = new Types.ObjectId(productId);

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      cart = new this.cartModel({
        userId: userId,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productObjectId, quantity });
    }

    await cart.populate('items.product');
    const saveCart = await cart.save();

    return (await saveCart.populate('items.product')).populate('userId');
  };

  //   getting the users cart
  getCart = async (userid: string): Promise<Cart> => {
    const cart = await this.cartModel
      .findOne({ userId: userid })
      .populate('userId', 'name')
      .populate('items.product');

    if (!cart) {
      throw new NotFoundException(
        'No cart found for this user, add items to cart',
      );
    }
    cart.items.sort((a: any, b: any) => a.createdAt - b.createdAt);
    return cart;
  };

  //   deleting the items from the cart
  deleteItemFromCart = async (userId: string, productId: string) => {
    const cart = await this.cartModel.findOne({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingItemIndex > -1) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      throw new NotFoundException('Item not found in cart');
    }

    await cart.populate('items.product');
    const saveCart = await cart.save();

    return (await saveCart.populate('items.product')).populate('userId');
  };

  //   revoming all the items from the cart
  deleteAllItemsFromCart = async (userId: string) => {
    const cart = await this.cartModel.findOne({ userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = [];

    await cart.populate('items.product');
    const saveCart = await cart.save();

    return (await saveCart.populate('items.product')).populate('userId');
  };
}
