const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;

import { Request, Response, Application } from 'express';
import {
  googleClientId,
  googleClientSecret,
  rootUrl,
  googleRedirect,
} from './config';
import Logger from './core/Logger';
import UserRepo from './database/repository/UserRepo';
import { GoogleToken, User, UserModel } from './database/model/User';
import { addNewCustomer } from './stripe';
import { Subscription } from './database/model/Subscription';
import SubscriptionRepo from './database/repository/SubscriptionRepo';

export default (app: Application): void => {
  passport.use(
    new Strategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: `${rootUrl}/${googleRedirect}`,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
      ) => {
        let email;
        let avatarUrl;
        if (profile.emails) {
          email = profile.emails[0].value;
        }

        if (profile.photos && profile.photos.length > 0) {
          avatarUrl = profile.photos[0].value.replace('sz=50', 'sz=128');
        }

        try {
          const createdSubscription = await SubscriptionRepo.create();
          const userProps: User = {
            googleId: profile.id as string,
            email: email as string,
            googleToken: {
              access_token: accessToken,
              refresh_token: refreshToken,
            } as GoogleToken,
            name: profile.displayName as string,
            profilePicUrl: avatarUrl as string,
            subscription: createdSubscription as Subscription,
          };
          const user = await UserRepo.signInOrSignUp(userProps);
          done(null, user);
        } catch (err) {
          done(err);
          Logger.error(err);
        }
      },
    ),
  );

  passport.serializeUser((user: User, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((user: User, done: any) => {
    UserModel.find({ googleId: user.googleId }, (err: Error, user: User) => {
      done(err, user);
    });
  });

  app.use(passport.initialize());
  app.use(passport.session());

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    }),
  );

  app.get(
    '/googleRedirect',
    passport.authenticate('google', {
      failureRedirect: '/redirect',
    }),
    async (req: Request, res: Response) => {
      // @ts-ignore
      const customer = await addNewCustomer(req.session?.passport?.user.email);
      req.session.customerID = customer;

      res.redirect('/api');
    },
  );
};
