import nanoid from "nanoid";
import {
  compareSecret,
  getRefreshToken,
  getAccessToken,
  checkAuth,
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
import { response } from "util/functions";

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // Get the sub by their email
  var user = null;
  try {
    user = await getUserByEmail(req.body.email, { return: true });
  } catch (error) {
    return res
      .status(400)
      .json(response("ERROR", "EMAIL_TAKEN", "Email already taken"));
  }

  // Get a users local auth info
  var auth = null;
  try {
    auth = await getUserAuth(user.sub, "local");
  } catch (error) {
    return res
      .status(400)
      .json(response("ERROR", "USERNAME_TAKEN", "Username already taken"));
  }

  // Check if they are verified
  if (!auth.emailVerified) {
    return res
      .status(400)
      .json(
        response(
          "ERROR",
          "EMAIL_NOT_VERIFIED",
          "Email is not confirmed, please verify it"
        )
      );
  }

  // Check if their password is correct
  if (!compareSecret(req.body.password, auth.secret)) {
    return res
      .status(400)
      .json(response("ERROR", "PASSWORD_INCORRECT", "Password is incorrect"));
  }

  // Update their auth asynchronously, reset their attempts to 0.
  try {
    updateUserAuthLocal(user.sub, { attempts: 0 });
  } catch (err) {
    return res.status(400).send(err.message);
  }

  var deviceID = nanoid.nanoid();
  const ip = req.connection.remoteAddress;
  const refreshToken = getRefreshToken(128);
  const accessToken = getAccessToken(user.sub, user.role, 60); //fixme: put back to a shorter time
  const expiresAt = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  // If device already exists, re-authenticate it

  if (req.body.deviceID) {
    console.log("device exists!");
    //@ts-ignore
    var deviceID = req.body.deviceID;

    var device = null;
    try {
      device = await getDevice(user.sub, req.body.deviceID);
    } catch (err) {
      return res.status(400).send(err.message);
    }
    try {
      await updateDevice(user.sub, req.body.deviceID, {
        lastSeen: new Date().toISOString(),
        lastIP: ip,
        refreshToken,
        expiresAt,
      });
    } catch (err) {
      return res.status(400).send(err.message);
    }
  } else {
    try {
      await createDevice(
        user.sub,
        deviceID,
        new Date().toISOString(),
        req.headers["user-agent"],
        "Unknown Device",
        ip,
        refreshToken,
        expiresAt
      );
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  // Send new idToken and refreshToken to device
  // res.send(req.connection.remoteAddress);
  res.json(
    response("SUCCESS", "LOG_IN", "Logged in Successfully", {
      deviceID,
      refreshToken,
      accessToken,
      user
    })
  );
};

export default login;
