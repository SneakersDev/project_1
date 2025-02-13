import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { findUserByEmail, createUser } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUserByEmail(profile.emails[0].value);
        if (!user) {
          const uid = profile.id;
          await createUser(uid, profile.emails[0].value, null, "google");
          user = await findUserByEmail(profile.emails[0].value);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// 🔹 GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await findUserByEmail(profile.emails[0].value);
        if (!user) {
          const uid = profile.id;
          await createUser(uid, profile.emails[0].value, null, "github");
          user = await findUserByEmail(profile.emails[0].value);
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
