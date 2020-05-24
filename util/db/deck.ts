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

export interface IDeck {
  deckID?: string;
  updatedAt?: string;
  createdAt?: string;
  title?: string;
  subject?: string;
  module?: string;
  acl?: IAcl;
  review?: number;
  userID?: string;
}

/**
 * Create a new Deck
 *
 * @param title - Title of the deck
 * @param userID - User who made it
 * @param acl - [optional] Access Control List
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

  // Ensure the user, module and subject are correct todo: subject

  try {
    const [user, mod] = await Promise.all([
      getUserByID(userID),
      getModule(module),
    ]);
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
      if (res.Count == 0) throw new Error("deck not found");
      var deck = res.Items[0];

      const theDeck: IDeck = {
        deckID: deck.partitionKey.substring(5, deck.partitionKey.length),
        title: deck.title,
        userID: deck.user,
        review: parseInt(deck.var1.substring(7, deck.var1.length)),
        module: res.Items[1].sortKey.substring(5, res.Items[1].sortKey.length),
        subject: res.Items[2].sortKey.substring(5, res.Items[2].sortKey.length),
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        acl: deck.acl,
      };
      return theDeck;
    });
};

export const updateDeck = async (deckID: string, properties: IDeck) => {
  // Lets check if we need to update the review, or module, or subject
  var updateSub = false;
  var updateMod = false;

  const currentDeck = await getDeck(deckID);

  if (properties.module) updateMod = true;
  if (properties.subject) updateSub = true;

  if (properties.review) {
    updateMod = true;
    updateSub = true;
  }

  var promises = [];

  if (updateMod) {
    promises.push(
      updateDeckModule(
        deckID,
        properties.module,
        properties.review ? properties.review : null
      )
    );
  }
  if (updateSub) {
    promises.push(
      updateDeckSubject(
        deckID,
        properties.subject,
        properties.review ? properties.review : null
      )
    );
  }

  return await Promise.all(promises).then((res) => {
    console.log(res);
    return res;
  });
};

export const updateDeckSubject = (
  deckID: string,
  subject: string,
  review: number = null
) => {
  // If you are only
  if (!review) {
    var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: "CardCollab",
      Item: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#${subject}`,
        var1: `review#${review}`,
      },
    };
    return docClient.put(params).promise();
  }
};

export const updateDeckModule = (
  deckID: string,
  module: string,
  review: number = null
) => {
  var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `deck#${deckID}`,
      sortKey: `deck#${module}`,
      var1: `review#${review}`,
    },
  };
  return docClient.put(params).promise();
};
