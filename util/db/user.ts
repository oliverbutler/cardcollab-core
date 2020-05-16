import nanoid from "nanoid";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

export const createUser = (
  givenName: string,
  familyName: string,
  username: string,
  email: string,
  role: string[] = ["student"]
) => {
  const userID = nanoid.nanoid();

  var params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#${userID}`,
            givenName: givenName,
            familyName: familyName,
            role: role,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#username`,
            data: username,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#email`,
            data: email,
          },
        },
      },
    ],
  };

  return docClient.transactWrite(params).promise();
};
