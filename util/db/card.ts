import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

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
  var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `deck#${deckID}`,
      sortKey: "card#" + uuidv4(),
      question: question,
      answer: answer,
    },
  };

  return docClient.put(params).promise();
};

/**
 * Delete a card
 *
 * @param deckID - Deck card belongs to
 * @param cardID - Card to delete
 */
export const deleteCard = (deckID: string, cardID: string) => {
  var params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: "Decks",
    Key: {
      partitionKey: `deck#${deckID}`,
      sortKey: "card#" + cardID,
    },
  };
  return docClient.delete(params).promise();
};

/**
 * Updates a card
 *
 * @param deckID - Deck ID containing the card
 * @param cardID - Card ID
 * @param question [optional] - Question to update
 * @param answer [optional] - Answer to update
 */
export const updateCard = (
  deckID: string,
  cardID: string,
  question: string = null,
  answer: string = null
) => {
  var UpdateExpression = "set ";
  if (question) UpdateExpression + "question = :q, ";
  if (answer) UpdateExpression + "answer = :a, ";

  UpdateExpression = UpdateExpression.substr(0, UpdateExpression.length - 2); // remove trailing comma

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "Decks",
    Key: {
      partitionKey: deckID,
      sortKey: "card#" + cardID,
    },
    UpdateExpression,
    ExpressionAttributeValues: {
      ":q": question,
      ":a": answer,
    },
  };
  return docClient.update(params);
};
