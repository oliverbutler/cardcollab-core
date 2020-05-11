import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refreshSchema = new Schema({
  token: { type: String, required: true },
  sub: { type: String, required: true },
});

var Card = mongoose.model("Card", refreshSchema);

module.exports = Card;
