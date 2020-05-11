import mongoose, { Schema, Document } from "mongoose";

function toCapitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Interface for defining an identity, e.g. an auth provider
 */
export interface IIdentity extends Document {
  provider: string;
  id: string;
  isSocial: boolean;
}

/**
 * Interface for defining a User
 */
export interface IUser extends Document {
  username: string;
  dateOfBirth: Date;
  givenName: string;
  familyName: string;
  email: string;
  identities: Array<IIdentity>;
  roles: Array<"student" | "admin">;
}

const identity = new Schema({
  provider: { type: String, required: true },
  id: { type: String, required: true },
  isSocial: { type: Boolean, required: true },
});

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
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
  emailVerified: { type: Boolean, default: false },
  emailCallback: String,
  identities: [identity],
  roles: [{ type: String, default: ["student"] }],
  picture: String,
  secret: String,
  updatedAt: Date,
  lastIp: String,
  lastLogin: Date,
  loginCount: Number,
});

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.emailCallback;
  delete obj.dateOfBirth;
  delete obj.identities;
  delete obj.secret;
  delete obj.lastIp;
  delete obj.lastLogin;
  delete obj.loginCount;
  return obj;
};

export default mongoose.model<IUser>("User", userSchema);
