import nanoid from "nanoid";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

export const addModule = async (
  university: string,
  moduleCode: string,
  title: string,
  active: boolean
) => {
  var params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      CardCollab: [
        {
          PutRequest: {
            Item: {
              partitionKey: `module#uni#${university}`,
              sortKey: `module#uni#${university}#${moduleCode}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              partitionKey: `module#uni#${university}#${moduleCode}`,
              sortKey: `moduleInfo`,
              title: title,
              active: active,
            },
          },
        },
      ],
    },
  };

  return await docClient
    .batchWrite(params)
    .promise()
    .then((res) => {
      return "success!";
    })
    .catch((err) => {
      console.log(err);
      return new Error("Failed to add module");
    });
};

export const getModules = async (university: string, moduleCode: string) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `module#uni#${university}`,
      ":sk": `module#uni#${university}#${moduleCode}`,
    },
  };
  return await docClient
    .query(params)
    .promise()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return new Error("Error query");
    });
};

export const getModule = async (partitionKey: string) => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: partitionKey,
      sortKey: "moduleInfo",
    },
  };
  return await docClient
    .get(params)
    .promise()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return new Error("Error getting module");
    });
};
