import mongoose from "mongoose";
import dbConnect from "../../../../middlewares/db";

const register = async (req, res) => {
  const { User } = mongoose.models;

  const user = new User(req.body);
  await user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

export default dbConnect(register);
