import mongoose from "mongoose";
import dbConnect from "middleware/db";
import { sleep } from "util/functions";
import { getSecret, signJWT } from "util/auth";
import nanoid from "nanoid";

/**
 *  Login route for local authentication, takes email and password,
 *  returns short lived JWT (15min) + a long(ish) lived Refresh Token (24hour)
 */
const login = (req, res) => {
  if (!req.body.email || !req.body.password)
    res.status(400).send("Must contain email and password");

  console.log(req.body);

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
      const refreshToken = nanoid.nanoid(64);

      res.send({ idToken, refreshToken });
    } else
      res
        .status(400)
        .send({ status: "error", message: "Incorrect email or password" });
  });
};

export default dbConnect(login);
