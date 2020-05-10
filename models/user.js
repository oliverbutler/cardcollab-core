const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

function toCapitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const identity = new Schema({
  provider: String,
  id: String,
  isSocial: Boolean,
});

const userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  dateOfBirth: Date,
  givenName: { type: String, required: true, set: toCapitalize },
  familyName: { type: String, required: true, set: toCapitalize },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Not a valid email",
    ],
  },
  cards: [Schema.Types.ObjectId],
  emailVerified: { type: Boolean, default: false },
  identities: [identity],
  roles: [String],
  picture: String,
  secret: String,
  updatedAt: Date,
  lastIp: String,
  lastLogin: Date,
  loginCounts: Number,
});

var User = mongoose.model("User", userSchema);

module.exports = User;
