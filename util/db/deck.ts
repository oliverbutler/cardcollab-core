import nanoid from "nanoid";
import AWS from "aws-sdk";

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
 * @param user - User who made it
 * @param acl - Access Control List
 * @param subject - Subject in the form subject#XXXXXXXXXX
 * @param module - Module in the form module#XXXXXXXXXXX
 */
export const createDeck = (
  title: string,
  user: string,
  subject: string,
  module: string,
  acl: IAcl = [{ type: "group", id: "public", read: true, write: false }],
  config: IConfig = { return: false }
) => {
  var deckID = nanoid.nanoid();

  var params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `deck#${deckID}`,
            sortKey: `deck#${deckID}`,
            title,
            user,
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
  return docClient.transactWrite(params).promise();
};

/**
 * Get a deck given its ID
 *
 * @param deckID
 */
export const getDeck = (deckID: string) => {
  var params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: `deck#${deckID}`,
    },
  };
  return docClient.get(params).promise();
};

/**
 * Update any parameter of a deck
 *
 * @param deckID Deck ID
 * @param title [optional] - Title of the Deck
 * @param user [optional] - User ID
 * @param score [optional] - Score
 * @param acl [optional] - ACL
 * @param report [optional] - Reports against the deck
 * @param subject [optional] - Subject of the deck
 * @param module [optional] - Module of the deck
 */
export const updateDeck = async (deckID: string, deckChanges: {}) => {
  var UpdateExpression = "set ";
  if (deckChanges["title"]) UpdateExpression += "title = :t, ";
  if (deckChanges["user"]) UpdateExpression += "#user = :u, ";
  if (deckChanges["acl"]) UpdateExpression += "acl = :a, ";
  if (deckChanges["report"]) UpdateExpression += "report: = :r, ";
  if (deckChanges["score"]) UpdateExpression += "score = :s, ";

  UpdateExpression = UpdateExpression.substr(0, UpdateExpression.length - 2); // remove trailing comma

  // As subject and store are on a different row for instant retrieval via GSI overloading
  // a query must first be performed to know the correct composite key to update

  if (deckChanges["score"] || deckChanges["subject"])
    await updateDeckSubject(
      deckID,
      deckChanges["subject"],
      deckChanges["score"]
    ).catch((err) => {
      console.log(err);
    });

  if (deckChanges["score"] || deckChanges["module"]) {
    await updateDeckModule(
      deckID,
      deckChanges["module"],
      deckChanges["score"]
    ).catch((err) => {
      console.log(err);
    });
  }

  if (UpdateExpression.length > 4) {
    var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: "CardCollab",
      Key: {
        partitionKey: `deck#${deckID}`,
        sortKey: `deck#${deckID}`,
      },
      UpdateExpression,
      ExpressionAttributeValues: {
        ":t": deckChanges["title"],
        ":u": deckChanges["user"],
        ":s": deckChanges["score"],
        ":a": deckChanges["acl"],
        ":r": deckChanges["report"],
      },
    };
    if (deckChanges["user"])
      params.ExpressionAttributeNames = {
        "#user": "user",
      };

    console.log(params);

    return docClient.update(params).promise();
  } else {
    return ":)";
  }
};

/**
 * Function to allow updating a decks subject or the score (the score stored in the subject)
 *
 * @param deckID
 * @param subject
 * @param score
 */
export const updateDeckSubject = async (
  deckID: string,
  subject: string = null,
  score: number = null
) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: `partitionKey = :did and begins_with(sortKey, :sub)`,
    ExpressionAttributeValues: {
      ":did": `deck#${deckID}`,
      ":sub": "deck#subject",
    },
  };
  const oldItem = await docClient
    .query(params)
    .promise()
    .then((data) => {
      return data.Items[0];
    })
    .catch((err) => {
      console.log("updateDeckSubject failed");
    });

  var deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: oldItem["sortKey"],
    },
  };

  await docClient
    .delete(deleteParams)
    .promise()
    .catch((err) =>
      console.log("updateDeckSubject failed (deleting old item)")
    );

  var putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `deck#${deckID}`,
      sortKey: subject ? `deck#${subject}` : oldItem["subject"],
      var1: score ? `review#${score}` : oldItem["var1"],
    },
  };
  return docClient.put(putParams).promise();
};

/**
 * Function to allow updating a decks module or the score (the score stored in the module)
 *
 * @param deckID
 * @param module
 * @param score
 */
export const updateDeckModule = async (
  deckID: string,
  module: string = null,
  score: number = null
) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: `partitionKey = :did and begins_with(sortKey, :sub)`,
    ExpressionAttributeValues: {
      ":did": `deck#${deckID}`,
      ":sub": "deck#module",
    },
  };
  const oldItem = await docClient
    .query(params)
    .promise()
    .then((data) => {
      return data.Items[0];
    })
    .catch((err) => {
      console.log("updateDeckModule failed");
    });

  var deleteParams: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: oldItem["sortKey"],
    },
  };

  await docClient
    .delete(deleteParams)
    .promise()
    .catch((err) => console.log("updateDeckModule failed (deleting old item)"));

  var putParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `deck#${deckID}`,
      sortKey: module ? `deck#${module}` : oldItem["module"],
      var1: score ? `review#${score}` : oldItem["var1"],
    },
  };
  return docClient.put(putParams).promise();
};
