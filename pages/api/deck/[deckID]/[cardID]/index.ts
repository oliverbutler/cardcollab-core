//@ts-nocheck

import { NextApiRequest, NextApiResponse } from "next";
import { deleteCard } from "util/db/card";
import { validateBody } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "DELETE":
      await deleteCard(req.query.deckID, req.query.cardID)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
      break;

    default:
      return res.status(405).end();
  }
};

export default index;
