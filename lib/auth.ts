import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getConfig from "next/config";

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
export const getSecret = (str: String) => {
  return bcrypt.genSaltSync(15, str);
};
