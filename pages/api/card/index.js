import mongoose from "mongoose";
import dbConnect from "../../../middlewares/db";

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      const cards = await mongoose.models.Card.find(
        req.query.q ? JSON.parse(req.query.q) : {}
      );
      res.send(cards);
      break;

    case "POST":
      const newCard = new mongoose.models.Card(req.body);
      await newCard
        .save()
        .then(() => {
          res.status(201).send(newCard);
        })
        .catch((error) => {
          res.status(400).end();
        });
      break;

    case "PUT":
      mongoose.models.Card.updateMany(
        req.query.q ? JSON.parse(req.query.q) : {},
        req.body
      ).then((cards, err) => {
        if (err) res.status(400).end();
        else res.status(200).send(cards);
      });
      break;

    case "DELETE":
      mongoose.models.Card.deleteMany(
        req.query.q ? JSON.parse(req.query.q) : {}
      ).then((cards, err) => {
        if (err) res.status(400).end();
        else res.status(204).end();
      });
      break;
  }
};

export default dbConnect(handler);
