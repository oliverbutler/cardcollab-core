import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, getUpdateExpression } from "util/functions";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Add a card to a deck
 *
 * @param deckID - Deck ID
 * @param question - Question
 * @param answer - Answer
 */
export const addCard = (deckID: string, question: string, answer: string) => {
  const cardID = nanoid.nanoid();
  var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `deck#${deckID}`,
      sortKey: "card#" + cardID,
      question: question,
      answer: answer,
    },
  };

  return docClient
    .put(params)
    .promise()
    .then((res) => {
      return cardID;
    });
};

/**
 * Returns all the cards of a deck in an array
 *
 * @param deckID
 */
export const getCards = (deckID: string) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `deck#${deckID}`,
      ":sk": "card#",
    },
  };
  return docClient
    .query(params)
    .promise()
    .then((res) => {
      var cards = res.Items.map((value) => {
        return {
          cardID: value.sortKey.substring(5, value.sortKey.length),
          question: value.question,
          answer: value.answer,
        };
      });
      return cards;
    });
};

/**
 * Get an individual card
 *
 * @param deckID
 * @param cardID
 */
export const getCard = (deckID: string, cardID: string) => {
  var params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: `card#${cardID}`,
    },
  };
  return docClient
    .get(params)
    .promise()
    .then((value) => {
      if (isEmpty(value.Item)) throw new Error("No Card Found");
      return {
        cardID: value.Item.sortKey.substring(5, value.Item.sortKey.length),
        question: value.Item.question,
        answer: value.Item.answer,
      };
    });
};

/**
 * Delete a card
 *
 * @param deckID - Deck card belongs to
 * @param cardID - Card to delete
 */
export const deleteCard = (deckID: string, cardID: string) => {
  var params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: "card#" + cardID,
    },
  };
  return docClient
    .delete(params)
    .promise()
    .then((res) => {
      return "Successfully deleted card";
    });
};

/**
 * Updates a card
 *
 * @param deckID - Deck ID containing the card
 * @param cardID - Card ID
 * @param question [optional] - Question to update
 * @param answer [optional] - Answer to update
 */
export const updateCard = (deckID: string, cardID: string, properties: {}) => {
  if (isEmpty(properties))
    return Promise.reject(new Error("Nothing to update"));

  const {
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  } = getUpdateExpression(properties);

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: `card#${cardID}`,
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  };
  return docClient
    .update(params)
    .promise()
    .then((res) => {
      return "Successfully updated card";
    });
};
