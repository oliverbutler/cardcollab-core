import { NextApiRequest, NextApiResponse } from "next";
import { getDeck, updateDeck } from "util/db/deck";
import { addCard } from "util/db/card";
import { checkAuth } from "util/auth";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure the user is authenticated
  try {
    checkAuth(req);
  } catch (err) {
    return res.status(401).send(err.message);
  }

  // Check whether user owns the deck
  var ownDeck = false;

  try {
    const deck = await getDeck(req.query.deckID.toString());
    if (req["user"].userID == deck["user"]) ownDeck = true;
    else ownDeck = false;
  } catch (err) {
    return res.status(400).send(err.message);
  }

  // As this pertains to a specific deck, let a user access only their own, or an admin access any

  switch (req.method) {
    case "POST":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res.status(401).send("Must be an admin");
      await addCard(
        req.query.deckID.toString(),
        req.body.question,
        req.body.answer
      )
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    case "GET":
      // @ts-ignore
      await getDeck(req.query.deckID)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    case "PATCH":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res.status(401).send("Must be an admin");

      // @ts-ignore
      await updateDeck(req.query.deckID, req.body)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    default:
      return res.status(405).end();
  }
};

export default index;
