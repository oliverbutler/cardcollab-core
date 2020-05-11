import mongoose from "mongoose";
import dbConnect from "../../../../middlewares/db";
import { sleep } from "../../../../lib/functions";
import { getSecret, signJWT } from "../../../../lib/auth";
import crypto from "crypto";

/**
 *  Login route for local authentication, takes email and password,
 *  returns short lived JWT (15min) + a long(ish) lived Refresh Token (24hour)
 */
const login = (req, res) => {
  if (!req.body.email || req.body.password)
    res.status(400).send("Must contain email and password");

  const { User } = mongoose.models;

  User.findOne({ email: req.body.email }, async (err, user) => {
    if (err) {
      var delay = Math.floor(Math.random() * 300) + 200;
      await sleep(delay); // to defend against time-based attacks, as an invalid email
      // would respond much faster than hashing to compare passwords
      res
        .status(400)
        .send({ status: "error", message: "Incorrect email or password" });
    }

    if (getSecret(req.body.password) == user.secret) {
      const idToken = signJWT({
        iat: Date.now(),
        exp: Date.now() + 15 * 60,
        sub: user._id,
        username: user.username,
      });
      const refreshToken = crypto.randomBytes(100).toString("hex");

      res.send({ idToken, refreshToken });
    } else
      res
        .status(400)
        .send({ status: "error", message: "Incorrect email or password" });
  });
};

export default dbConnect(login);
