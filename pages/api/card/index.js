import mongoose from "mongoose";
import dbConnect from "../../../middlewares/db";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      res.send(mongoose.connection.models);
    // const newCard = new mongoose.models.Card(req.body);
    // await newCard
    //   .save()
    //   .then(() => {
    //     res.status(201).send(newCard);
    //   })
    //   .catch((error) => {
    //     res.status(400).send(error);
    //   });
    default:
      res.status(405).end();
  }
};

export default dbConnect(handler);
