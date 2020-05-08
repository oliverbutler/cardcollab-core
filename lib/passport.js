const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import mongoose from "mongoose";

const secret = "secret";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, cb) {
      return mongoose.models.User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: "Incorrect Email" });
          }
          var valid = bcrypt.compareSync(password, user.password);
          if (valid) {
            return cb(null, user, { message: "Logged In Successfully" });
          } else {
            return cb(null, false, { message: "Incorrect Password" });
          }
        })
        .catch((err) => cb(err));
    }
  )
);

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    function (jwt_payload, cb) {
      mongoose.models.User.findById(jwt_payload._id, (err, user) => {
        if (user) {
          return cb(null, user);
        } else {
          return cb(null, false);
          // or you could create a new account
        }
      });
    }
  )
);

// JWT but returns user without doing a DB query
passport.use(
  "jwt-basic",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    },
    function (jwt_payload, cb) {
      return cb(null, jwt_payload);
    }
  )
);
