import { model, Schema, Document } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface GoogleToken {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expiry_date?: number;
}

export interface User {
  name?: string;
  googleId: string;
  googleToken: GoogleToken;
  email: string;
  password?: string;
  profilePicUrl: string;
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserType = User & Document;

const schema = new Schema(
  {
    googleId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    googleToken: {
      access_token: String,
      refresh_token: String,
      token_type: String,
      expiry_date: Number,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
      select: false,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
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
