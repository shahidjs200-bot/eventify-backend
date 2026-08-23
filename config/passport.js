import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        async(accessToken,refreshToken,profile,done) => {
            try{
              let user = await User.findOne({googleId:profile.id})
              if(!user){
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                });
              }
              return  done(null,user);
            } catch(err){
              return  done(err,null)
            }
        }
    )
);

export default passport;