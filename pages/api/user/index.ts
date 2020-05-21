import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getUserByID, getUserByEmail } from "util/db/user";
import { validateBody } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      try {
        const user = await createUser(
          req.body.givenName,
          req.body.familyName,
          req.body.username,
          req.body.email,
          req.body.dateOfBirth
        );
        return res.send(user);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
    case "GET":
      try {
        const user = await getUserByEmail(req.body.email, { return: true });
        return res.send(user);
      } catch (error) {
        console.log(error);
        return res.send(error);
      }

    default:
      return res.status(405).end();
  }
};

export default index;
