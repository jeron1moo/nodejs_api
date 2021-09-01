import dotenv from 'dotenv';
dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
};

export const dbURI = `mongodb://${db.host}:${db.port}/${db.name}`;

export const corsUrl = process.env.CORS_URL;

export const logDirectory = process.env.LOG_DIRECTORY;

export const googleClientId = process.env.GOOGLE_CLIENT_ID;
export const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const name = process.env.SESSION_NAME || 'nodejs-api';
export const secret = process.env.SESSION_SECRET || 'secret';

export const rootUrl = process.env.ROOT_URL || 'http://localhost:5000';
export const googleRedirect = process.env.GOOGLE_REDIRECT || 'googleRedirect';

export const appId = process.env.GITHUB_APP_ID || 1;
export const privateKey = process.env.GITHUB_PRIVATE_KEY || 'as';
export const clientId = process.env.GITHUB_CLIENT_ID || 'id';
export const clientSecret = process.env.GITHUB_CLIENT_SECERET || 'secret';
