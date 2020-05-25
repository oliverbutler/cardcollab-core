import { NextApiRequest, NextApiResponse } from "next";
import { deleteCard, updateCard } from "util/db/card";
import { checkAuth } from "util/authServer";
import { IDeck, getDeck } from "util/db/deck";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure user is authenticated
  try {
    checkAuth(req);
  } catch (err) {
    return res.status(401).send(err.message);
  }

  const deckID = req.query.deckID.toString();
  //@ts-ignore
  const cardID: string = req.query.cardID;

  // Check whether user owns the deck
  var ownDeck = false;

  var deck: IDeck = null;
  try {
    deck = await getDeck(req.query.deckID.toString());
  } catch (err) {
    throw res.status(400).send(err.message);
  }

  if (req["user"].userID == deck.userID) ownDeck = true;

  switch (req.method) {
    case "DELETE":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res
          .status(401)
          .send("You don't have permission to delete this card");
      await deleteCard(deckID, cardID)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err.message);
        });
      break;

    case "PATCH":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res
          .status(401)
          .send("You don't have permission to update this card");

      await updateCard(deckID, cardID, req.body)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.send(err.message);
        });

    default:
      return res.status(405).end();
  }
};

export default index;
