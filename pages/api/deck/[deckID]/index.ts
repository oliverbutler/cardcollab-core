//@ts-nocheck

import { NextApiRequest, NextApiResponse } from "next";
import { getDeck, updateDeck } from "util/db/deck";
import { addCard } from "util/db/card";
import { validateBody } from "util/functions";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await addCard(req.query.deckID, req.body.question, req.body.answer)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
      break;
    case "GET":
      await getDeck(req.query.deckID)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err);
        });
      break;
    case "PATCH":
      await updateDeck(req.query.deckID, req.body)
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
