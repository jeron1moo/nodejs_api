import { User, UserModel, GoogleToken } from '../model/User';
import generateSlug from '../../utils/slugify';
import _ from 'lodash';

export default class UserRepo {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static async signInOrSignUp(user: User): Promise<User> {
    const isUser = await UserModel.findOne({
      googleId: user.googleId,
    });
    console.log(isUser);
    if (isUser) {
      const modifier: GoogleToken = {};

      if (user.googleToken.access_token) {
        modifier.access_token = user.googleToken.access_token;
      }

      if (user.googleToken.refresh_token) {
        modifier.refresh_token = user.googleToken.refresh_token;
      }

      if (_.isEmpty(modifier)) {
        return user;
      }

      await UserModel.updateOne(
        { googleId: user.googleId },
        { $set: modifier },
      );

      return user;
    }

    const slug = await generateSlug(UserModel, user.name || '');

    const userProps = {
      ...user,
      slug,
    };
    const createdUser = await UserModel.create(userProps);

    return createdUser;
  }
}
