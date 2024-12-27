import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { NotFoundError } from 'rxjs';

// DTO for adding items in the cart
export class AddToCartDto {
  productId: string;
  quantity: number;
}
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addTOCart(@Request() req, @Body() addToCartDTO: AddToCartDto) {
    try {
      if (!addToCartDTO.productId || !addToCartDTO.quantity) {
        throw new BadRequestException('Product ID and quantity are required');
      }
      const userId = req.user.userId;
      console.log(req.user);

      const cart = await this.cartService.addTOCart(
        userId,
        addToCartDTO.productId,
        addToCartDTO.quantity,
      );

      return {
        success: true,
        message: 'Item added to cart successfully',
        data: cart,
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        'Could not add item to cart' + ' : ' + error.message,
      );
    }
  }

  //   getting the uers cart
  @Get('get')
  async getCart(@Request() req) {
    try {
      const userId = req.user.userId;
      const cart = await this.cartService.getCart(userId);
      return {
        success: true,
        message: 'Cart items fetched successfully',
        data: cart,
      };
    } catch (error) {
      throw new BadRequestException(
        'Could not get cart items' + ' : ' + error.message,
      );
    }
  }

  //   removing elements from the cart
  @Delete('delete/:id')
  async deleteItemFromCart(@Request() req, @Param() productId: any) {
    try {
      const { id } = productId;
      if (!id) {
        throw new BadRequestException('Product ID is required');
      }
      //   console.log(productId.id);
      const userId = req.user.userId;
      const cart = await this.cartService.deleteItemFromCart(userId, id);
      return {
        success: true,
        message: 'Item deleted from cart successfully',
        data: cart,
      };
    } catch (error) {
      throw new BadRequestException(
        'Could not delete item from cart' + ' : ' + error.message,
      );
    }
  }

  //   removing all the items from the cart
  @Delete('clearAll')
  async deleteAllItemsFromCart(@Request() req) {
    try {
      const userId = req.user.userId;
      const cart = await this.cartService.deleteAllItemsFromCart(userId);
      return {
        success: true,
        message: 'All items deleted from cart successfully',
        data: cart,
      };
    } catch (error) {
      throw new BadRequestException(
        'Could not delete all items from cart' + ' : ' + error.message,
      );
    }
  }
}
