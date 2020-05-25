import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, arrayToHash, hashToArray } from "util/functions";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Add a new module OR university
 *
 * @param module
 * @param title - optional
 * @param active - optional
 */
export const addModule = (
  module: string[],
  title: string = null,
  active: boolean = true
) => {
  if (module[0] !== "uni")
    return Promise.reject(new Error("Only uni modules supported currently"));

  if (module.length == 3) {
    if (!title) {
      return Promise.reject(new Error("No title for the module"));
    }
    var params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        CardCollab: [
          {
            PutRequest: {
              Item: {
                partitionKey: `module#uni#${module[1].toLowerCase()}`,
                sortKey: `module#uni#${module[1].toLowerCase()}#${module[2].toLowerCase()}`,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                partitionKey: `module#uni#${module[1].toLowerCase()}#${module[2].toLowerCase()}`,
                sortKey: `module#info`,
                title: title,
                active: active,
              },
            },
          },
        ],
      },
    };
  } else if (module.length == 2)
    var params: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        CardCollab: [
          {
            PutRequest: {
              Item: {
                partitionKey: `module#uni`,
                sortKey: `module#uni#${module[1].toLowerCase()}`,
              },
            },
          },
        ],
      },
    };
  else return Promise.reject(new Error("Invalid module array"));

  console.log("here2");

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

/**
 * Deletes a module
 *
 * @param module - e.g ['uni', 'newcastle_university', 'csc2023']
 */
export const deleteModule = (module: string[]) => {
  // e.g. input ['uni', 'newcastle_university', 'csc2023']
  // Delete its entry under ['uni', 'newcastle_university'] as well as its module#info entry

  var modulePop = [...module];
  modulePop.pop();

  var promises = [];

  var params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `module#${arrayToHash(modulePop)}`,
      sortKey: `module#${arrayToHash(module)}`,
    },
  };

  promises.push(docClient.delete(params).promise());

  params = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `module#${arrayToHash(module)}`,
      sortKey: `module#info`,
    },
  };

  promises.push(docClient.delete(params).promise());

  return Promise.all(promises).then((res) => {
    return "Successfully Deleted Module";
  });
};
