import mongoose from "mongoose";
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  content: { type: String, required: true },
  sub: { type: String, required: true },
});

var Card = mongoose.model("Card", cardSchema);

module.exports = Card;
