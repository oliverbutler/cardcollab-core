import mongoose from "mongoose";
import dbConnect from "middleware/db";
import { NextApiRequest, NextApiResponse } from "next";

function callback(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.cid) return res.status(400).end();

  const { User } = mongoose.models;

  User.findOneAndUpdate(
    { emailCallback: req.query.cid },
    { emailVerified: true, $unset: { emailCallback: "" } }
  ).then(() => {
    res.writeHead(301, {
      Location: "https://cardcollab.com",
    });
    res.end();
  });
}

export default dbConnect(callback);
