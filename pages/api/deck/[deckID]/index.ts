import { NextApiRequest, NextApiResponse } from "next";
import { getDeck, updateDeck, IDeck, deleteDeck } from "util/db/deck";
import { addCard, getCards } from "util/db/card";
import { checkAuth } from "util/authServer";

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  // Ensure the user is authenticated
  try {
    checkAuth(req);
  } catch (err) {
    return res.status(401).send(err.message);
  }

  const deckID = req.query.deckID.toString();

  // Check whether user owns the deck
  var ownDeck = false;

  var deck: IDeck = null;
  try {
    deck = await getDeck(req.query.deckID.toString());
  } catch (err) {
    throw res.status(400).send(err.message);
  }

  if (req["user"].userID == deck.userID) ownDeck = true;

  // As this pertains to a specific deck, let a user access only their own, or an admin access any

  switch (req.method) {
    case "POST":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res
          .status(401)
          .send("You don't have permission to edit this deck");
      await addCard(deckID, req.body.question, req.body.answer)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;

    case "GET":
      await Promise.all([getDeck(deckID), getCards(deckID)]).then((value) => {
        //@ts-ignore
        value[0].cards = value[1];
        res.send(value[0]);
      });

      break;
    case "PATCH":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res
          .status(401)
          .send("You don't have permission to edit this deck");

      await updateDeck(deckID, req.body)
        .then((value) => {
          return res.send(value);
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
      break;
    case "DELETE":
      if (!ownDeck && !req["user"].role.includes("admin"))
        return res
          .status(401)
          .send("You don't have permission to delete this deck");

      await deleteDeck(deckID)
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
