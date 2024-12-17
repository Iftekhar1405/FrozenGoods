import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  //   User registration
  async register(createUserDto: CreateUserDto) {
    const { phoneNumber, password } = createUserDto;

    const exisitingUser = await this.userModel.findOne({ phoneNumber });
    if (exisitingUser) throw new ConflictException('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new  User
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  //   User Login
  async login(logInDto: LogInDto) {
    const { phoneNumber, password } = logInDto;

    const user = await this.userModel.findOne({ phoneNumber });

    if (!user) {
      throw new UnauthorizedException('Invalid Credantials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentails');
    }

    // Generate JWT
    const payload = {
      sub: user._id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }
}
