require('dotenv').config();

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const prisma = new PrismaClient();

// google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        // find or create user in the database
        const user = await prisma.user.upsert({
            where: { googleId: profile.id },
            update: {
                email: profile.emails[0].value,
                displayName: profile.displayName,
                profilePictureUrl: profile.photos[0].value,
                accessToken,
                refreshToken,
            },
            create: {
                googleId: profile.id,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                profilePictureUrl: profile.photos[0].value,
                accessToken,
                refreshToken,
            },
        });
        cb(null, user); // no error, return user
    } catch (err) {
        cb(err, null); // error, return null
    }
  }
));

// jwt strategy
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: jwt_payload.id }
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));