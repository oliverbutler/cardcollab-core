import mongoose from "mongoose";
import dbConnect from "../../../middlewares/db";

const { Card } = mongoose.models;

const handler = async (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        const cards = await Card.find(
          req.query.q ? JSON.parse(req.query.q) : {}
        );
        res.send(cards);
        break;

      case "POST":
        const newCard = new Card(req.body);
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
        Card.updateMany(
          req.query.q ? JSON.parse(req.query.q) : {},
          req.body
        ).then((cards, err) => {
          if (err) res.status(400).end();
          else res.status(200).send(cards);
        });
        break;

      case "DELETE":
        Card.deleteMany(req.query.q ? JSON.parse(req.query.q) : {}).then(
          (cards, err) => {
            if (err) res.status(400).end();
            else res.status(204).end();
          }
        );
        break;
    }
  } catch (err) {
    res.send(err);
  }
};

export default dbConnect(handler);
