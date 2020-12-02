const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('../config');

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
      },
      async (jwt_payload, done) => {
        try {
          if (jwt_payload) {
            return done(null, jwt_payload);
          }
          return done(null, false);
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
};
