import { NextApiRequest, NextApiResponse } from "next";
import {
  createUser,
  getUserByID,
  getUserByEmail,
  getUserByUsername,
} from "util/db/user";
import { checkAuth } from "util/authServer";
import { response } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    checkAuth(req, "admin");
  } catch (err) {
    return res.status(401).send(err.message);
  }

  switch (req.method) {
    case "POST":
      try {
        const user = await createUser(
          undefined,
          req.body.givenName,
          req.body.familyName,
          req.body.username,
          req.body.email,
          req.body.birthDate
        );
        return res.send(user);
      } catch (error) {
        return res.status(400).send(error.message);
      }
    case "GET":

      // console.log(req['user'])

      try {
        var user = null;
        if (req.body.email)
          user = await getUserByEmail(req.body.email, { return: true });
        else if (req.body.username)
          user = await getUserByUsername(req.body.username, { return: true });
        else if (req.body.sub) user = await getUserByID(req.body.sub);
        else user = await getUserByID(req['user'].sub)

        return res.send(user)

      } catch (error) {
        return res.send(error.message);
      }

    default:
      return res.status(405).end();
  }
};

export default index;
