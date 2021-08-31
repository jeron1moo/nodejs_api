/* eslint-disable @typescript-eslint/no-var-requires */
const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;

import { googleClientId, googleClientSecret } from './config';
import Logger from './core/Logger';

export default (app: any, ROOT_URL: any): void => {
  passport.use(
    new Strategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: 'http://localhost:5000/googleRedirect',
      },
      (accessToken: any, refreshToken: any, profile: any, done: any) => {
        Logger.info(accessToken, refreshToken, profile);
        done(null, profile);
      },
    ),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
  );
};
