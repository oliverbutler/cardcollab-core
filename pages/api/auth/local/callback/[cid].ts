import mongoose from "mongoose";
import dbConnect from "middleware/db";

function callback(req, res) {
  if (!req.query.cid) res.status(400).end();

  const { User } = mongoose.models;

  User.findOneAndUpdate(
    { emailCallback: req.query.cid },
    { emailVerified: true, $unset: { emailCallback: "" } }
  ).then((err, user) => {
    res.writeHead(301, {
      Location: "https://cardcollab.com",
    });
    res.end();
  });
}

export default dbConnect(callback);
