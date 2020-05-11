import mongoose from "mongoose";
import dbConnect from "../../../middlewares/db";

const test = async (req, res) => {
  await mongoose.models.Card.find(
    req.query.q ? JSON.parse(req.query.q) : {},
    (cards, err) => {
      if (err) res.send(err);
      else res.send(cards);
    }
  );
};

export default dbConnect(test);
