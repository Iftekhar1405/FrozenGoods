import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  Post,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { response, Response } from 'express';
import { unescape } from 'querystring';
import { TokenLogService } from 'src/Models/token.models';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenLogService: TokenLogService,
  ) { }

  private setCookie(response: Response, token: string, exp = false) {
    if (!exp) {
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 365,
      });
    } else {
      response.cookie('access_token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  }
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (createUserDto.role === 'admin') {
      throw new ForbiddenException(`Aukat me reh bhadwe`);
    }
    // console.log(createUserDto);
    const { access_token, ...userInfo } =
      await this.authService.register(createUserDto);
    this.setCookie(response, access_token);
    return userInfo;
  }

  @Post('login')
  async login(
    @Body() loginDto: LogInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, ...userInfo } =
      await this.authService.login(loginDto);

    this.setCookie(response, access_token);
    return userInfo;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Request() req, @Res({ passthrough: true }) response: Response) {
    const token = req.cookies?.access_token;
    // console.log(token)
    if (token) {
      await this.tokenLogService.markTokenAsLoggedOut(token);
    }

    this.setCookie(response, token, true);

    return { message: 'Logged out successfully.' };
  }

  @Get('profile')
  getProfile(@Request() req) {
    // console.log(req);
    return req.user;
  }
}
