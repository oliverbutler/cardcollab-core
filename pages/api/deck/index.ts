import { NextApiRequest, NextApiResponse } from "next";
import { createDeck } from "util/db/deck";
import { validateBody } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const errors = validateBody(req.body, [
        "title",
        "user",
        "subject",
        "module",
      ]);
      if (errors) return res.status(400).send(errors);

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
