import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
})
export class User extends Document {
  // for name
  @Prop({
    required: true,
    trim: true,
  })
  name: string;
  // for phonenumber
  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  phoneNumber: string;

  // for password
  @Prop({
    required: true,
  })
  password: string;

  // for role
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  //   is active
  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
