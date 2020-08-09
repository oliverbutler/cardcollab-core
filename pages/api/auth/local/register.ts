import nanoid from "nanoid";
import getConfig from "next/config";
import { genSecret } from "util/authServer";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail, getUserByUsername, createUser } from "util/db/user";
import { updateUserAuthLocal, createUserCallback } from "util/db/auth";
import { sendEmailConfirmation } from "util/mail";
import { response } from "util/functions";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  // Generate userID, emailCallback and secret

  var userID = nanoid.nanoid();
  var emailCallback = nanoid.nanoid();
  var secret = genSecret(req.body.password);

  // Save user to DB

  try {
    await createUser(
      userID,
      req.body.givenName,
      req.body.familyName,
      req.body.username,
      req.body.email,
      req.body.birthDate
    );
  } catch (error) {
    return res.status(500).send(response("ERROR", "", error.message));
  }

  // Save auth data to DB

  try {
    await updateUserAuthLocal(userID, { secret, emailVerified: false });
  } catch (error) {
    console.log(error);
    return res.status(500).send(response("ERROR", "", error.message));
  }

  // Save callback to DB

  try {
    await createUserCallback(userID, emailCallback);
  } catch (error) {
    console.log(error);
    return res.status(500).send(response("ERROR", "", error.message))
  }

  // Send email confirmation async (just send it)

  sendEmailConfirmation(req.body.email, req.body.givenName, emailCallback);

  return res.status(201).send(response("SUCCESS", "USER_CREATED", "User created, please confirm your email"));
};

export default register;
