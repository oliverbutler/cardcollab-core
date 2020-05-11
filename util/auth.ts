import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getConfig from "next/config";
import nanoid from "nanoid";
import { IUser } from "models/user";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

/**
 * Payload for an id_token
 *
 * @param exp - Expires At
 * @param iat - Issued At
 * @param nbf - Not before
 * @param sub - Subject of the JWT, e.g. userID
 */
export type Payload = {
  exp: number;
  iat: number;
  sub: String;
  username: String;
};

/**
 *
 * @param payload - Object to store in JWT
 */
export const signJWT = (payload: Payload) => {
  return jwt.sign(payload, serverRuntimeConfig.SECRET, { algorithm: "ES512" });
};

/**
 * Verify a JWT using jsonwebtoken and servers secret
 *
 * @param JWT - JWT to verify
 */
export const verifyJWT = (JWT) => {
  return jwt.verify(JWT, serverRuntimeConfig.SECRET);
};

/**
 * Generates a secret using bcrypt, uses the SECRET key in .env
 *
 * @param str - The string to hash
 */
export const genSecret = async (str: string) => {
  const salt = bcrypt.genSaltSync(15);
  return bcrypt.hashSync(str, salt);
};

/**
 * Generate an idToken using a user
 *
 * @param user - User for the JWT
 */
export const genIdToken = (user: IUser) => {
  return signJWT({
    iat: Date.now(),
    exp: Date.now() + 15 * 60,
    sub: user._id,
    username: user.username,
  });
};

/**
 * Generate a refresh token, just a nanoID
 *
 * @param length - Length of refresh token. 32 default
 */
export const genRefreshToken = (length: number = 32) => {
  return nanoid.nanoid(length);
};
