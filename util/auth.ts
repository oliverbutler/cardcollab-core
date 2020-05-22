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
  role: string[];
};

/**
 *
 * @param payload - Object to store in JWT
 */
export const signJWT = (payload: Payload) => {
  return jwt.sign(payload, serverRuntimeConfig.SECRET);
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
  const salt = bcrypt.genSaltSync(13);
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
 * Generates an accessToken for a given user
 *
 * @param userID
 * @param role
 * @param lifeSpan - life span in minutes
 */
export const getAccessToken = (
  userID: string,
  role: string[],
  lifeSpan: number = 5
): string => {
  return signJWT({
    iat: Date.now(),
    exp: Date.now() + lifeSpan * 60,
    sub: userID,
    role: role,
  });
};

/**
 * Generate a refresh token, just a nanoID
 *
 * @param length - Length of refresh token. 100 default
 */
export const getRefreshToken = (length: number = 100): string => {
  return nanoid.nanoid(length);
};
