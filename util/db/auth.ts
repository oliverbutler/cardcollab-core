import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, getUpdateExpression } from "util/functions";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

export interface IAuth {
  emailVerified: boolean;
  secret: boolean;
  attempts: 0;
  partitionKey: string;
  sortKey: string;
}

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

/**
 *  Set local auth for a user
 *
 * @param userID
 * @param properties - properties to update
 */
export const updateUserAuthLocal = (userID: string, properties: {}) => {
  const {
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  } = getUpdateExpression(properties);

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: `user#auth#local`,
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  };
  return docClient.update(params).promise();
};

/**
 * Get all user auth info,
 * - if type specified returns single item
 * - if no type, returns array
 *
 * @param userID
 */
export const getUserAuth = (userID: string, type: string = "") => {
  var query: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `user#${userID}`,
      ":sk": type ? `user#auth#${type}` : "user#auth",
    },
  };
  return docClient
    .query(query)
    .promise()
    .then((res) => {
      if (res.Count == 0) throw new Error("No user auth found");
      if (type) return res.Items[0];
      else return res.Items;
    });
};

/* -------------------------------------------------------------------------- */
/*                                  Callback                                  */
/* -------------------------------------------------------------------------- */

/**
 * Creates the entry in DynamoDB for the callback info, allows for fast searching via GSI1
 * @param userID
 * @param callback
 */
export const createUserCallback = async (userID: string, callback: string) => {
  var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `user#${userID}`,
      sortKey: `user#callback`,
      var1: callback,
    },
  };
  return await docClient
    .put(params)
    .promise()
    .then(() => {
      return "Success";
    });
};

/**
 * Verifies callback, returns promise to get the ID for the user.
 *
 * @param callback
 */
export const verifyCallback = async (callback: string) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    IndexName: "GSI1",
    KeyConditionExpression: "sortKey = :pk and var1 = :sk",
    ExpressionAttributeValues: {
      ":pk": "user#callback",
      ":sk": callback,
    },
  };
  const data = await docClient
    .query(params)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      return new Error("Failed to find callback");
    });

  if (data["Items"] == []) return new Error("Invalid Token");
  try {
    // @ts-ignore
    var partitionKey = data.Items[0].partitionKey;
    return await docClient
      .delete({
        TableName: "CardCollab",
        Key: {
          partitionKey: partitionKey,
          sortKey: "user#callback",
        },
      })
      .promise()
      .then((d) => {
        return partitionKey.substr(5, partitionKey.length);
      })
      .catch((err) => {
        console.log(err);
        return new Error("Couldnt delete the callback item");
      });
  } catch (error) {
    return new Error("Invalid query response");
  }
};

/* -------------------------------------------------------------------------- */
/*                                   Device                                   */
/* -------------------------------------------------------------------------- */

/**
 * Create a new device, e.g. add a new browser, phone etc.
 *
 * @param userID - userID of user
 * @param deviceID - new device iD
 * @param lastSeen - current time probably
 * @param userAgent - name e.g. Chrome 432.0 Windows...
 * @param friendlyName - let the user give devices a custom name
 * @param lastIP - the last IP, used to detect irregularities
 * @param refreshToken - the refresh token assigned to this device
 * @param expiresAt - The time the refresh token expires at
 */
export const createDevice = (
  userID: string,
  deviceID: string,
  lastSeen: string,
  userAgent: string,
  friendlyName: string,
  lastIP: string,
  refreshToken: string,
  expiresAt: string
) => {
  var params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: "CardCollab",
    Item: {
      partitionKey: `user#${userID}`,
      sortKey: `device#${deviceID}`,
      lastSeen,
      userAgent,
      friendlyName,
      lastIP,
      refreshToken,
      expiresAt,
    },
  };

  return docClient
    .put(params)
    .promise()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw err;
    });
};

/**
 * Get a device given userID and deviceID
 *
 * @param userID
 * @param deviceID
 */
export const getDevice = async (userID: string, deviceID: string) => {
  var params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: `device#${deviceID}`,
    },
  };
  return docClient
    .get(params)
    .promise()
    .then((res) => {
      if (isEmpty(res)) throw new Error("Device not found");
      return res.Item;
    });
};

/**
 * Update a device
 *
 * @param userID
 * @param deviceID
 * @param properties - which properties of the device to update
 */
export const updateDevice = (
  userID: string,
  deviceID: string,
  properties: {}
) => {
  const {
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  } = getUpdateExpression(properties);

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: `device#${deviceID}`,
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  };

  return docClient
    .update(params)
    .promise()
    .then((res) => {
      return "Success";
    });
};
