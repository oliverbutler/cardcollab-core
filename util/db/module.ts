import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty } from "util/functions";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

export const addModule = async (
  university: string,
  moduleCode: string,
  title: string,
  active: boolean = true
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
              sortKey: `module#info`,
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
      return "Success";
    })
    .catch((err) => {
      throw err;
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
      return res.Items;
    })
    .catch((err) => {
      throw err;
    });
};

export const getModule = async (partitionKey: string) => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: partitionKey,
      sortKey: "module#info",
    },
  };
  return await docClient
    .get(params)
    .promise()
    .then((res) => {
      if (isEmpty(res)) throw new Error("Module not found");
      return res.Item;
    })
    .catch((err) => {
      throw err;
    });
};

// export const deleteModule = async (module) => {
//   const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
//     TableName: "CardCollab",
//     Key: {
//       partitionKey: "module#uni#newcastle_university",
//       sortKey: module,
//     },
//   };
//   return await docClient
//     .delete(params)
//     .promise()
//     .then(() => {
//       return "success";
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
