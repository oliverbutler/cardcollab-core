import nanoid from "nanoid";
import {
  compareSecret,
  getRefreshToken,
  getAccessToken,
} from "util/authServer";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail } from "util/db/user";
import {
  getUserAuth,
  createDevice,
  updateUserAuthLocal,
  getDevice,
  updateDevice,
} from "util/db/auth";
import geoip from "geoip-lite";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the UserID by their email
  var user = null;
  try {
    user = await getUserByEmail(req.body.email, { return: true });
  } catch (error) {
    return res.status(400).send("Email not found");
  }

  // Get a users local auth info
  var auth = null;
  try {
    auth = await getUserAuth(user.userID, "local");
  } catch (error) {
    return res.status(400).send("user auth not found");
  }

  // Check if they are verified
  if (!auth.emailVerified) {
    return res.status(400).send("Email not confirmed");
  }

  // Check if their password is correct
  if (!compareSecret(req.body.password, auth.secret)) {
    return res.status(400).send("Password Incorrect");
  }

  // Update their auth asynchronously, reset their attempts to 0.
  try {
    updateUserAuthLocal(user.userID, { attempts: 0 });
  } catch (error) {
    console.log(error);
  }

  const deviceID = nanoid.nanoid();
  const ip = req.connection.remoteAddress;
  const refreshToken = getRefreshToken(128);
  const accessToken = getAccessToken(user.userID, user.role, 60); //fixme: put back to a shorter time
  const expiresAt = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  // If device already exists, re-authenticate it

  if (req.body.deviceID) {
    var device = null;
    try {
      device = await getDevice(user.userID, req.body.deviceID);
    } catch (err) {
      throw err;
    }
    try {
      await updateDevice(user.userID, req.body.deviceID, {
        lastSeen: new Date().toISOString(),
        lastIP: ip,
        refreshToken,
        expiresAt,
      });
    } catch (err) {
      throw err;
    }
  } else {
    try {
      await createDevice(
        user.userID,
        deviceID,
        new Date().toISOString(),
        req.headers["user-agent"],
        "Unknown Device",
        ip,
        refreshToken,
        expiresAt
      );
    } catch (err) {
      throw err;
    }
  }

  // Send new idToken and refreshToken to device
  // res.send(req.connection.remoteAddress);
  res.send({ deviceID, refreshToken, accessToken });
};

export default login;
