import { NextApiRequest, NextApiResponse } from "next";
import { createDeck } from "util/db/deck";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await createDeck(
        req.body.title,
        req.body.user,
        req.body.subject,
        req.body.module
      )
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });

    default:
      return res.status(405).end();
  }
};

export default index;
