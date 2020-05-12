import mongoose from "mongoose";
import dbConnect from "middleware/db";
import { sleep } from "util/functions";
import {
  genSecret,
  genIdToken,
  genRefreshToken,
  compareSecret,
} from "util/auth";
import { IUser, IDevice, IIdentity } from "models/user";
import { NextApiResponse, NextApiRequest } from "next";

/**
 *  Login route for local authentication, takes email and password,
 *  returns short lived JWT (5min) + a long(ish) lived Refresh Token (24hour)
 */
const login = (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.body.password || !req.body.email) {
    return res.status(400).send("Must contain email and password");
  }

  const { User, Device } = mongoose.models;

  User.findOne({ email: req.body.email }, async (err, user: IUser) => {
    if (user == null) {
      var delay = Math.floor(Math.random() * 300) + 200;
      await sleep(delay);
      // to defend against time-based attacks, as an invalid email
      // would respond much faster than hashing to compare passwords todo: check the timings to make more secure
      return res.status(400).send("Incorrect email or password");
    } else {
      console.log(user);
      // Compare the given password to the one in the identity
      const identity: IIdentity = user.identities.find(
        (i) => i.provider === "local"
      );

      if (compareSecret(req.body.password, identity.secret)) {
        const refreshToken = genRefreshToken();

        // todo: Check device ID (a cookie we will store), if its new,
        // send confirmation email to check it is them,
        // get a new refresh token, otherwise modify old device

        const newDevice: IDevice = new Device({
          friendlyName: "Unknown Device",
          refreshToken: refreshToken,
          refreshTokenCreatedAt: new Date(),
          refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60),
        });

        user.devices.push(newDevice);
        user.save().catch((err) => res.send(err));

        return res.send({
          idToken: genIdToken(user),
          refreshToken: genRefreshToken(),
          deviceId: newDevice.id,
        });
      } else return res.status(400).send("Incorrect email or password 2");
    }
  });
};

export default dbConnect(login);
