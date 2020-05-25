import { NextApiRequest, NextApiResponse } from "next";
import {
  createUser,
  getUserByID,
  getUserByEmail,
  getUserByUsername,
  updateUser,
} from "util/db/user";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    checkAuth(req, "admin");
  } catch (err) {
    return res.status(401).send(err.message);
  }

  // todo: fine grained control over user, e.g. students can change names, pictures etc.

  // @ts-ignore
  const userID: string = req.query.userID;

  switch (req.method) {
    case "PATCH":
      await updateUser(userID, req.body)
        .then((val) => {
          return res.send(val);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });

    default:
      return res.status(405).end();
  }
};

export default index;
