import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../Models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from './dto/login.dto';
import { TokenLogService } from 'src/Models/token.models';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private tokenLogService: TokenLogService,
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
    await newUser.save();

    // console.log(newUser);
    const payload = {
      sub: newUser._id,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
    };
    const access_token = this.jwtService.sign(payload);
    await this.tokenLogService.logTokenCreation(
      newUser._id.toString(),
      access_token,
    );
    return {
      id: newUser._id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      access_token: access_token,
    };
  }

  //   User Login
  async login(logInDto: LogInDto) {
    const { phoneNumber, password } = logInDto;

    const user = await this.userModel.findOne({ phoneNumber });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid Credantials: No user with this phone number.',
      );
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

    const access_token = this.jwtService.sign(payload);
    await this.tokenLogService.logTokenCreation(
      user._id.toString(),
      access_token,
    );
    return {
      id: user._id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
      access_token: access_token,
    };
  }
}
