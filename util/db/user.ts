import nanoid from "nanoid";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

export interface IConfig {
  return: boolean;
}

export interface IUser {
  userID: string;
  givenName: string;
  familyName: string;
  role: string[];
  email: string;
  username: string;
}

/* -------------------------------------------------------------------------- */
/*                                    User                                    */
/* -------------------------------------------------------------------------- */

/**
 * Create a user in the db
 *
 * @param givenName
 * @param familyName
 * @param username
 * @param email
 * @param role - optional role, defaults to ['student]
 */
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
            var1: username,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#email`,
            var1: email,
          },
        },
      },
    ],
  };

  return docClient.transactWrite(params).promise();
};

/**
 * Get a user given their userID
 *
 * @param userID
 */
export const getUserByID = async (userID: string) => {
  var params: AWS.DynamoDB.DocumentClient.TransactGetItemsInput = {
    TransactItems: [
      {
        Get: {
          TableName: "CardCollab",
          Key: {
            partitionKey: `user#${userID}`,
            sortKey: `user#${userID}`,
          },
        },
      },
      {
        Get: {
          TableName: "CardCollab",
          Key: {
            partitionKey: `user#${userID}`,
            sortKey: `user#username`,
          },
        },
      },
      {
        Get: {
          TableName: "CardCollab",
          Key: {
            partitionKey: `user#${userID}`,
            sortKey: `user#email`,
          },
        },
      },
    ],
  };

  return await docClient
    .transactGet(params)
    .promise()
    .then((data) => {
      const user: IUser = {
        userID: userID,
        givenName: data.Responses[0].Item["givenName"],
        familyName: data.Responses[0].Item["familyName"],
        role: data.Responses[0].Item["role"],
        email: data.Responses[1].Item["var1"],
        username: data.Responses[2].Item["var1"],
      };
      return user;
    })
    .catch((err) => {
      return new Error("Cant get user by ID");
    });
};

/**
 * Returns user matching the email given
 *
 * @param email - email to query
 */
export const getUserByEmail = async (
  email: string,
  config: IConfig = { return: true }
) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    IndexName: "GSI1",
    KeyConditionExpression: "sortKey = :sk and var1 = :email",
    ExpressionAttributeValues: {
      ":sk": "user#email",
      ":email": email,
    },
  };
  return await docClient
    .query(params)
    .promise()
    .then(async (data) => {
      const userID = data.Items[0].partitionKey.substring(5);

      if (config.return)
        return await getUserByID(userID)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err);
            return new Error("cant find user by id");
          });
      else return userID;
    })
    .catch(() => {
      return new Error("Cant find user");
    });
};

/* -------------------------------------------------------------------------- */
/*                                    Auth                                    */
/* -------------------------------------------------------------------------- */

/**
 * Set the local auth for a user
 *
 * @param userID
 * @param secret
 * @param twoFactor
 * @param attempts
 * @param timeout
 */
export const setUserAuthLocal = async (
  userID: string,
  secret: string = undefined,
  twoFactor: string = undefined,
  attempts: string = undefined,
  timeout: string = undefined
) => {
  var exp = "set ";
  if (secret) exp += "secret = :s, ";
  if (twoFactor) exp += "twoFactor = :t, ";
  if (attempts) exp += "attempts = :a, ";
  if (timeout) exp += "timeout = :ti, ";

  exp = exp.substr(0, exp.length - 2);

  var params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: `user#auth#local`,
    },
    UpdateExpression: exp,
    ExpressionAttributeValues: {
      ":s": secret,
      ":t": twoFactor,
      ":a": attempts,
      ":ti": timeout,
    },
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
