import connectDb from "../../../../middlewares/db";
import mongoose from "mongoose";

const handler = async (req, res) => {
  if (req.method == "POST") {
    const newUser = new mongoose.models.User(req.body);
    await newUser
      .save()
      .then(() => {
        res.status(201).send(newUser);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    res.status(405).end();
  }
};

export default connectDb(handler);
