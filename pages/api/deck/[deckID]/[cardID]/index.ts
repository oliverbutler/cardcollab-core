import { NextApiRequest, NextApiResponse } from "next";
import { deleteCard } from "util/db/card";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "DELETE":
      // @ts-ignore
      await deleteCard(req.query.deckID, req.query.cardID)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err.message);
        });
      break;

    default:
      return res.status(405).end();
  }
};

export default index;
