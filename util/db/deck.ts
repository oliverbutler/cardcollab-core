import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty } from "util/functions";
import { getUserByID } from "./user";
import { getModule } from "./module";
import decks from "pages/decks";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Interface for an Access Control List (ACL), includes the type of user,
 */
export interface IAcl {
  [index: number]: {
    type: "user" | "group";
    id: string;
    read: boolean;
    write: boolean;
  };
}

export interface IConfig {
  return: boolean;
}

/**
 * Create a new Deck
 *
 * @param title - Title of the deck
 * @param userID - User who made it
 * @param acl - Access Control List
 * @param subject - Subject in the form subject#XXXXXXXXXX
 * @param module - Module in the form module#XXXXXXXXXXX
 */
export const createDeck = async (
  title: string,
  userID: string,
  subject: string,
  module: string,
  acl: IAcl = [{ type: "group", id: "public", read: true, write: false }],
  config: IConfig = { return: false }
) => {
  var deckID = nanoid.nanoid();

  try {
    await Promise.all([getUserByID(userID), getModule(module)]);
  } catch (err) {
    throw err;
  }

  var params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `deck#${deckID}`,
            sortKey: `deck#info`,
            title,
            userID,
            acl,
            var1: `review#0`,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `deck#${deckID}`,
            sortKey: `deck#${module}`,
            var1: `review#0`,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `deck#${deckID}`,
            sortKey: `deck#${subject}`,
            var1: `review#0`,
          },
        },
      },
    ],
  };
  return docClient
    .transactWrite(params)
    .promise()
    .then((res) => {
      return deckID;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Get a deck given its ID
 *
 * @param deckID
 */
export const getDeck = (deckID: string) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `deck#${deckID}`,
      ":sk": `deck#`,
    },
  };
  return docClient
    .query(params)
    .promise()
    .then((res) => {
      if (isEmpty(res)) throw new Error("No Deck found");
      var deck = res.Items[0];

      return {
        deckID: deck.partitionKey.substring(5, deck.partitionKey.length),
        title: deck.title,
        userID: deck.user,
        review: parseInt(deck.var1.substring(7, deck.var1.length)),
        module: res.Items[1].sortKey.substring(5, res.Items[1].sortKey.length),
        subject: res.Items[2].sortKey.substring(5, res.Items[2].sortKey.length),
        acl: deck.acl,
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const updateDeck = async () => {};
