import mongoose from "mongoose";
import dbConnect from "middleware/db";
import { NextApiRequest, NextApiResponse } from "next";
import { IUser, IDevice } from "models/user";
import { genIdToken } from "util/auth";

const refresh = (req: NextApiRequest, res: NextApiResponse) => {
  const { User } = mongoose.models;

  if (!req.body.did || !req.body.sub || !req.body.refreshToken)
    return res.status(400).send("Missing Parameters");

  User.findOne({ id: req.body.sub }, (err, user: IUser) => {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(400).send("Invalid user"); // remove useful information from this
    const device: IDevice = user.devices.find(
      (d: IDevice) => d.id == req.body.did
    );
    if (!device) return res.status(400).send("Invalid device");
    if (device.refreshToken == req.body.refreshToken) {
      if (device.refreshTokenCreatedAt > new Date(Date.now()))
        return res.status(400).send("Too Soon");
      if (device.refreshTokenExpiresAt < new Date(Date.now()))
        return res.status(400).send("Expired");

      return res.send(genIdToken(user));
    } else return res.status(400).send("Invalid Token");
  });
};

export default dbConnect(refresh);
