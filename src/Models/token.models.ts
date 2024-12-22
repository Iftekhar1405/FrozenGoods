import { Inject, Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { IpAccessControlListMappingPage } from 'twilio/lib/rest/api/v2010/account/sip/domain/ipAccessControlListMapping';
import { callbackify } from 'util';

@Schema({ timestamps: true, expires: '1h' })
export class TokenLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: false })
  isLoggedOut: boolean;

  @Prop()
  loggedOutAt?: Date;
}

export const TokenLogSchma = SchemaFactory.createForClass(TokenLog);

@Injectable()
export class TokenLogService {
  constructor(
    @InjectModel(TokenLog.name) private tokenLogModel: Model<TokenLog>,
  ) {}

  async logTokenCreation(userId: string, token: string) {
    const tokenLog = new this.tokenLogModel({
      userId,
      token,
      isLoggedOut: false,
    });

    return await tokenLog.save();
  }

  async markTokenAsLoggedOut(token: string) {
    await this.tokenLogModel.findOneAndUpdate(
      { token, isLoggedOut: false },
      { isLoggedOut: true, loggedOutAt: new Date() },
    );
  }

  async isTokenvalid(token: string): Promise<boolean> {
    const tokenLog = await this.tokenLogModel.findOne({ token });

    if (!tokenLog || tokenLog.isLoggedOut) return false;

    return true;
  }
}
