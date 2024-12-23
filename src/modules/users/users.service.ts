import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../Models/user.model';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Getting all uses
  async getAllUsers() {
    try {
      const users = await this.userModel.find({}, { password: 0 });
      if (!users || users.length === 0) {
        throw new HttpException('No user found,', HttpStatus.NOT_FOUND);
      }
      return { data: users };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch users.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //   Getting single Users
  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id, { password: 0 });
      return user || null;
    } catch (error) {
      throw new HttpException(
        `Invalid user ID formal or error occurred: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: updateUserDto },
        { new: true, runValidators: true, omitUndefined: true },
      );
      return updatedUser;
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

  async showCurrentUser(userId: string) {
    try {
      const user = await this.userModel.findById(userId, { password: 0 });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch current user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser() {}
}
