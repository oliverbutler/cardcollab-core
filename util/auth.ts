import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getConfig from "next/config";
import nanoid from "nanoid";

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
export const genSecret = (str: string): string => {
  const salt = bcrypt.genSaltSync(15);
  return bcrypt.hashSync(str, salt);
};

/**
 * Compare a secret to the hash using bcrypt
 *
 * @param secret
 * @param hash
 */
export const compareSecret = (secret: string, hash: string): boolean => {
  return bcrypt.compareSync(secret, hash);
};

/**
 * Generate an idToken using a user
 *
 * @param user - User for the JWT
 */
export const genIdToken = (userID): string => {
  return signJWT({
    iat: Date.now(),
    exp: Date.now() + 5 * 60,
    sub: userID,
  });
};

/**
 * Generate a refresh token, just a nanoID
 *
 * @param length - Length of refresh token. 32 default
 */
export const genRefreshToken = (length: number = 32): string => {
  return nanoid.nanoid(length);
};
