import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, arrayToHash, hashToArray } from "util/functions";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Add a new module
 *
 * @param module
 * @param title
 * @param active
 */
export const addModule = async (
  module: string[],
  title: string,
  active: boolean = true
) => {
  if (module[0] !== "uni")
    throw new Error("Only uni modules supported currently");

  var params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      CardCollab: [
        {
          PutRequest: {
            Item: {
              partitionKey: `module#uni#${module[1]}`,
              sortKey: `module#uni#${module[1]}#${module[2]}`,
            },
          },
        },
        {
          PutRequest: {
            Item: {
              partitionKey: `module#uni#${module[1]}#${module[2]}`,
              sortKey: `module#info`,
              title: title,
              active: active,
            },
          },
        },
      ],
    },
  };

  return docClient
    .batchWrite(params)
    .promise()
    .then((res) => {
      return "Success";
    });
};

/**
 * Return an array of modules given the module it belongs to, and the search parameter
 *
 * @param module
 * @param search
 */
export const getModules = async (module: string[], search: string) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `module#${arrayToHash(module)}`,
      ":sk": `module#${arrayToHash(module)}#${search}`,
    },
  };
  return docClient
    .query(params)
    .promise()
    .then((res) => {
      const out = res.Items.map((module) => {
        return module.sortKey.split("#").pop();
      });
      return out;
    });
};

/**
 * Returns an individual module given its info
 *
 * @param module
 */
export const getModule = async (module: string[]) => {
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `module#${arrayToHash(module)}`,
      sortKey: "module#info",
    },
  };
  return await docClient
    .get(params)
    .promise()
    .then((value) => {
      if (isEmpty(value)) throw new Error("Module not found");
      return {
        active: value.Item.active,
        module: hashToArray(value.Item.partitionKey),
        title: value.Item.title,
      };
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteModule = () => {};
