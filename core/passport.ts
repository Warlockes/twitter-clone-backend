import { CallbackError } from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JWTstrategy } from "passport-jwt";

import { IUserModel, UserModel } from "../models/UserModel";
import { generateMD5 } from "../utils/generateHash";

passport.use(
  new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const user = await UserModel.findOne({
        $or: [{ email: username }, { username }],
      }).exec();

      if (!user) {
        return done(null, false, { message: "Неверный логин или e-mail" });
      }

      if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
        done(null, user);
      } else {
        done(null, false, { message: "Неверный пароль" });
      }
    } catch (error) {
      done(error, false);
    }
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_KEY || "123",
      jwtFromRequest: ExtractJwt.fromHeader("token"),
    },
    async (payload: { data: IUserModel }, done) => {
      try {
        const user = await UserModel.findById(payload.data._id).exec();

        if (user) {
          return done(null, user);
        }

        done(null, false);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

type SerializeUser = {
  _id?: string;
};

passport.serializeUser((user: SerializeUser, done) => {
  done(null, user?._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: CallbackError, user: IUserModel) => {
    done(err, user);
  });
});

export { passport };
