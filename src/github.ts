import { Request, Response, Application } from 'express';
import { privateKey, clientId, clientSecret, appId } from './config';
import { Octokit } from '@octokit/rest';
import { oauthAuthorizationUrl } from '@octokit/oauth-authorization-url';

export default (app: Application): void => {
  app.get('/auth/github', async (req: Request, res: Response) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${clientId}`,
    );
  });

  app.get('/auth/github/callback', (req: Request, res: Response) => {
    console.log(req.session);
    // const response = await fetch(
    //   'https://github.com/login/oauth/access_token',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-type': 'application/json;',
    //       Accept: 'application/json',
    //     },
    //     body: JSON.stringify({
    //       client_id: clientId,
    //       client_secret,
    //       code: req.query.code,
    //       state: req.query.state,
    //       redirect_uri: 'http://localhost:5000//auth/github/callback',
    //     }),
    //   },
    // );
    // res.redirect('/');
  });
};
