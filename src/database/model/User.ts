import { model, Schema, Document } from 'mongoose';
import { Subscription } from './Subscription';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface GoogleToken {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expiry_date?: number;
}

export interface User {
  name: string;
  googleId?: string;
  googleToken?: GoogleToken;
  email: string;
  password?: string;
  profilePicUrl: string;
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  subscription?: Subscription;
  billingID?: string;
}

type UserType = User & Document;

const schema = new Schema(
  {
    googleId: {
      type: String,
    },
    googleToken: {
      access_token: String,
      refresh_token: String,
      token_type: String,
      expiry_date: Number,
    },
    slug: {
      type: String,
      unique: true,
    },
    billingId: {
      type: String,
      unique: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },
    password: {
      type: String,
      select: false,
    },
    profilePicUrl: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

export const UserModel = model<UserType>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
