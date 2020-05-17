import nanoid from "nanoid";
import getConfig from "next/config";
import { genSecret } from "util/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail, getUserByUsername, createUser } from "util/db/user";
import { setUserAuthLocal, createUserCallback } from "util/db/auth";
import { sendEmailConfirmation } from "util/mail";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const register = async (req: NextApiRequest, res: NextApiResponse) => {
  // Validate the body

  //todo: check body content inc password strength etc.

  // Check that the email is available
  var check = await getUserByEmail(req.body.email, { return: false });
  if (check == {}) return res.status(400).send("Email Taken");

  // Check that the username is available

  var check = await getUserByUsername(req.body.username, { return: false });
  if (check == {}) return res.status(400).send("Username Taken");

  // Generate userID, emailCallback and secret

  var userID = nanoid.nanoid();
  var emailCallback = nanoid.nanoid();
  var secret = genSecret(req.body.password);

  // Save user to DB

  try {
    await createUser(
      req.body.givenName,
      req.body.familyName,
      req.body.username,
      req.body.email,
      req.body.dateOfBirth
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error saving user data");
  }

  // Save auth data to DB

  try {
    await setUserAuthLocal(userID, secret, null, 0, null, false);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error saving auth data");
  }

  // Save callback to DB

  try {
    await createUserCallback(userID, emailCallback);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error saving callback info");
  }

  // Send email confirmation async (just send it)

  sendEmailConfirmation(req.body.email, req.body.givenName, emailCallback);

  return res.status(201).send("User created, please confirm your email");
};

export default register;
