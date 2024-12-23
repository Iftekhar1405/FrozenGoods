import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { UserRole } from 'src/Models/user.model';

@Controller('products/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getAllCategories() {
    return await this.categoryService.getAllCategories();
  }

  @Post('/')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createCategory(@Body() body: any) {
    if (!body.name) {
      throw new BadRequestException('Please provide valid category name');
    }
    return await this.categoryService.createCategory(body.name);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateCategory(@Param() id: any, @Body() body: any) {
    console.log('id', id.id);
    const name = body.name;
    if (!id || !name) {
      throw new BadRequestException(
        'Invalid request! Must provide both category id and new name',
      );
    }

    return this.categoryService.updateCategory(id.id, name);
  }
}
