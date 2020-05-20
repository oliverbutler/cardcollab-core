import nanoid from "nanoid";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

/**
 *  Set local auth for a user
 *
 * @param userID
 * @param secret
 * @param twoFactor
 * @param attempts
 * @param timeout
 * @param emailVerified
 */
export const setUserAuthLocal = async (
  userID: string,
  secret: string = null,
  twoFactor: string = null,
  attempts: number = 0,
  timeout: string = null,
  emailVerified: boolean = false
) => {
  var exp = "set ";
  var values = {};
  if (secret) {
    exp += "secret = :s, ";
    values[":s"] = secret;
  }
  if (twoFactor) {
    exp += "twoFactor = :t, ";
    values[":t"] = twoFactor;
  }

  exp += "attempts = :at, ";
  values[":at"] = attempts;

  exp += "emailVerified = :email, ";
  values[":email"] = emailVerified;

  if (timeout) {
    exp += "timeout = :ti, ";
    values[":ti"] = timeout;
  }

  exp = exp.substr(0, exp.length - 2);

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: `user#auth#local`,
    },
    UpdateExpression: exp,
    ExpressionAttributeValues: values,
  };
  return await docClient
    .update(params)
    .promise()
    .then(() => {
      return "Success";
    })
    .catch((err) => {
      console.log(err);
      return new Error("Cant update user auth");
    });
};

/**
 * Get all user auth info
 *
 * @param userID
 */
export const getUserAuth = async (userID: string) => {
  var query: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    KeyConditionExpression: "partitionKey = :pk and begins_with(sortKey, :sk)",
    ExpressionAttributeValues: {
      ":pk": `user#${userID}`,
      ":sk": "user#auth",
    },
  };
  return await docClient
    .query(query)
    .promise()
    .then((res) => {
      return res.Items;
    })
    .catch((err) => {
      console.log(err);
      return new Error("Cant get user auth");
    });
};

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
    })
    .catch((err) => {
      console.log(err);
      return new Error("Error saving user callback info");
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
