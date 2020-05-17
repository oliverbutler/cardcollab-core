import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByID, getUserByEmail } from "util/db/user";
import { validateBody } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await createUser(
        req.body.givenName,
        req.body.familyName,
        req.body.username,
        req.body.email
      )
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
    case "GET":
      try {
        const user = await getUserByEmail(req.body.email, { return: true });
        return res.send(user);
      } catch (error) {
        return res.send(error);
      }

    default:
      return res.status(405).end();
  }
};

export default index;
