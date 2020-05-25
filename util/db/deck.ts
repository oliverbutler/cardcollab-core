import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, hashToArray, arrayToHash } from "util/functions";
import { getUserByID } from "./user";
import { getModule } from "./module";
import decks from "pages/decks";
import { getUpdateExpression } from "util/functions";
import { schema } from "schema/deck";

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
  subject?: string[];
  module?: string[];
  acl?: IAcl;
  review?: number;
  userID?: string;
  cards?: [{}];
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
  subject: string[],
  module: string[],
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
            sortKey: `deck#module#${arrayToHash(module)}`,
            var1: `review#0`,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `deck#${deckID}`,
            sortKey: `deck#subject#${arrayToHash(subject)}`,
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
      ":sk": "deck",
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
        userID: deck.userID,
        review: parseInt(deck.var1.substring(7, deck.var1.length)),
        module: hashToArray(
          res.Items[1].sortKey.substring(5, res.Items[1].sortKey.length)
        ),
        subject: hashToArray(
          res.Items[2].sortKey.substring(5, res.Items[2].sortKey.length)
        ),
        createdAt: deck.createdAt,
        updatedAt: deck.updatedAt,
        acl: deck.acl,
      };
      return theDeck;
    });
};

/**
 * Update a deck given its ID and the properties you wish to update
 *
 * @param deckID
 * @param properties
 */
export const updateDeck = async (deckID: string, properties: IDeck) => {
  var validate = schema.validate(properties);

  if (validate.error) {
    throw new Error(validate.error);
  }

  validate = validate.value;
  validate.updatedAt = new Date().toISOString();

  // Lets check if we need to update the review, or module, or subject
  var updateSub = false;
  var updateMod = false;

  const currentDeck = await getDeck(deckID);

  if (validate.module) updateMod = true;
  if (validate.subject) updateSub = true;

  if (validate.review !== undefined) {
    updateMod = true;
    updateSub = true;
  }

  var promises = [];

  if (updateMod) {
    promises.push(
      updateDeckModule(
        deckID,
        currentDeck.module,
        validate.module ? validate.module : currentDeck.module,
        validate.review ? validate.review : currentDeck.review
      )
    );
  }
  if (updateSub) {
    promises.push(
      updateDeckSubject(
        deckID,
        currentDeck.subject,
        validate.subject ? validate.subject : currentDeck.subject,
        validate.review ? validate.review : currentDeck.review
      )
    );
  }

  // Create a temp object to rename review, as this causes issues when
  // writing to the DB, as it is stored as "val1" and is prefixed by review#

  const newProperties: {} = { ...validate };
  if (validate.review !== undefined) {
    delete newProperties["review"];
    newProperties["var1"] = "review#" + validate.review;
  }

  const { UpdateExpression, ExpressionAttributeValues } = getUpdateExpression(
    newProperties
  );

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: `deck#info`,
    },
    UpdateExpression,
    ExpressionAttributeValues,
  };

  promises.push(docClient.update(params).promise());

  return await Promise.all(promises).then((res) => {
    return "Successfully Modified the deck";
  });
};

/**
 * Update a decks subject row, this involves deleting the row and putting it back,
 * because we have to change the sortKey
 *
 * @param deckID
 * @param currentSubject
 * @param subject
 * @param review
 */
export const updateDeckSubject = async (
  deckID: string,
  currentSubject: string[],
  subject: string[],
  review: number
) => {
  if (subject == currentSubject) {
    var updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#subject#${arrayToHash(currentSubject)}`,
      },
      UpdateExpression: `set var1 = :var1`,
      ExpressionAttributeValues: {
        ":var1": "review#" + review,
      },
    };
    return docClient.update(updateParams).promise();
  } else {
    var deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#subject#${arrayToHash(currentSubject)}`,
      },
    };

    await docClient.delete(deleteParams).promise();

    var putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: "CardCollab",
      Item: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#${subject}`,
        var1: `review#${review}`,
      },
    };

    return docClient.put(putParams).promise();
  }
};

export const updateDeckModule = async (
  deckID: string,
  currentModule: string[],
  module: string[],
  review: number
) => {
  if (module == currentModule) {
    var updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#module#${arrayToHash(currentModule)}`,
      },
      UpdateExpression: `set var1 = :var1`,
      ExpressionAttributeValues: {
        ":var1": "review#" + review,
      },
    };
    return docClient.update(updateParams).promise();
  } else {
    var deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#module#${arrayToHash(currentModule)}`,
      },
    };

    await docClient.delete(deleteParams).promise();

    var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: "CardCollab",
      Item: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#module#${arrayToHash(module)}`,
        var1: `review#${review}`,
      },
    };
    return docClient.put(params).promise();
  }
};

/**
 * Delete all rows associated with a deck
 *
 * @param deckID
 */
export const deleteDeck = async (deckID: string) => {
  var queryParam: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk",
    ExpressionAttributeValues: {
      ":pk": `deck#${deckID}`,
    },
  };
  const deckRows = await docClient
    .query(queryParam)
    .promise()
    .then((values) => {
      if (values.Count == 0) throw new Error("No deck found");
      return values.Items;
    });

  var promises = [];

  deckRows.forEach((row) => {
    var param: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: row.partitionKey,
        sortKey: row.sortKey,
      },
    };
    promises.push(docClient.delete(param).promise());
  });

  return Promise.all(promises).then((res) => {
    return "Successfully deleted";
  });
};
