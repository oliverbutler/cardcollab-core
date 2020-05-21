import nanoid from "nanoid";
import getConfig from "next/config";
import { genSecret } from "util/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserByEmail, getUserByUsername, createUser } from "util/db/user";
import { setUserAuthLocal, createUserCallback } from "util/db/auth";
import { sendEmailConfirmation } from "util/mail";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  // Check email + password
  const userID = await getUserByEmail(req.body.email, { return: false });
  if (userID == {}) return res.status(400).send("email not found");

  console.log(userID);

  res.send(":)");

  // send them the id_token and refresh_token
};

export default login;
