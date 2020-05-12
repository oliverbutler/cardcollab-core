import mongoose, { Schema, Document } from "mongoose";

function toCapitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Interface for defining an identity, e.g. an auth provider
 *
 * @param isSocial - Is this local or a social provider
 * @param id - Local user ID or oauth ID
 * @param secret - Password or Google/Facebook secret
 */
export interface IIdentity extends Document {
  provider: "local" | "google-oauth2" | "facebook-oauth";
  id: string;
  isSocial: boolean;
  secret: string;
}

/**
 * Interface for a users device(s). A way of managing
 * signed in devices and todo: measuring risk factors
 */
export interface IDevice extends Document {
  friendlyName: string;
  refreshToken: string;
  refreshTokenCreatedAt: Date;
  refreshTokenExpiresAt: Date;
  dateAdded: Date;
  riskFactor: Number;
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
  devices: Array<IDevice>;
  roles: Array<"student" | "admin">;
}

const identitySchema: Schema = new Schema(
  {
    provider: { type: String, required: true },
    id: { type: String, required: true },
    isSocial: { type: Boolean, required: true },
    password: { type: String },
    secret: { type: String },
  },
  { _id: false }
);

/**
 * Schema to define a device
 */
const deviceSchema: Schema = new Schema({
  friendlyName: { type: String },
  refreshToken: { type: String },
  refreshTokenCreatedAt: { type: Date },
  refreshTokenExpiresAt: { type: Date },
  dateAdded: { type: Date, default: new Date() },
  riskFactor: { type: Number },
});

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  givenName: { type: String, required: true, set: toCapitalize },
  familyName: { type: String, required: true, set: toCapitalize },
  picture: { type: String },
  roles: [{ type: String, default: ["student"] }],
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
  identities: [identitySchema],
  devices: [deviceSchema],
  lastIp: { type: String },
  lastLogin: { type: Date },
  loginCount: { type: Number },
});

/**
 * Remove sensitive data when returning a JSON of the user
 */
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.emailCallback;
  delete obj.dateOfBirth;
  delete obj.identities;
  delete obj.lastIp;
  delete obj.lastLogin;
  delete obj.loginCount;
  delete obj.devices;
  return obj;
};

mongoose.model<IUser>("User", userSchema);
mongoose.model<IDevice>("Device", deviceSchema);
mongoose.model<IIdentity>("Identity", identitySchema);
