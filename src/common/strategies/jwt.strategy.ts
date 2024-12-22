import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../Models/user.model';
import { Model } from 'mongoose';
import { Request } from 'express';
import { TokenLogService } from '../../Models/token.models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private tokenLogService: TokenLogService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  // cutom method to extract JWT from cookie
  private static extractJwtFromCookie(req: Request): string | null {
    // console.log(req.cookies?.access_token || null);

    return req.cookies?.access_token || null;
  }

  async validate(
    req: Request,
    payload: { sub: string; phoneNumber: string; role: string },
  ) {
    const token = req.cookies?.access_token;

    if (!token || !(await this.tokenLogService.isTokenvalid(token))) {
      throw new UnauthorizedException('invalid or expired Token');
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Unauthorized..');
    return {
      userId: payload.sub,
      phoneNumber: payload.phoneNumber,
      role: payload.role,
    };
  }
}
