import nanoid from "nanoid";
import AWS from "aws-sdk";

AWS.config.update({
  region: "eu-west-2",
});

var docClient = new AWS.DynamoDB.DocumentClient();

var cognito = new AWS.CognitoIdentityCredentials();

/* -------------------------------------------------------------------------- */
/*                              Type Definitions                              */
/* -------------------------------------------------------------------------- */

/**
 * Interface for DB Util Config
 */
export interface IConfig {
  return: boolean;
}

/**
 * Interface for a user
 */
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
 * @param dateOfBirth
 * @param role - optional role, defaults to ['student]
 *
 */
export const createUser = async (
  givenName: string,
  familyName: string,
  username: string,
  email: string,
  dateOfBirth: string,
  role: string[] = ["student"]
) => {
  const userID = nanoid.nanoid();

  var eCheck = null;
  var uCheck = null;

  // Check if the email is taken
  try {
    eCheck = await getUserByEmail(email, { return: false });
  } catch (err) {}

  if (eCheck != null) throw new Error("Email Taken");

  // Check if the username is taken
  try {
    uCheck = await getUserByUsername(username, { return: false });
  } catch (err) {}

  if (uCheck != null) throw new Error("Username Taken");

  // Write all of the users metadata to the DB
  var params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info`,
            givenName: givenName,
            familyName: familyName,
            dateOfBirth: dateOfBirth,
            role: role,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info#username`,
            var1: username,
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info#email`,
            var1: email,
          },
        },
      },
    ],
  };

  return await docClient
    .transactWrite(params)
    .promise()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
      return new Error("error");
    });
};

/**
 * Get a user given their userID todo: Look into using batch for better speed
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
      ":sk": "user#info#email",
      ":email": email,
    },
  };
  return await docClient
    .query(params)
    .promise()
    .then(async (data) => {
      const userID = data.Items[0].partitionKey.substring(5);
      console.log("userID" + userID);
      if (config.return)
        return await getUserByID(userID)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            throw new Error("cant find user by id");
          });
      else return userID;
    })
    .catch(() => {
      return new Error("Cant find user");
    });
};

/**
 * Returns user matching the username given
 *
 * @param username - username to query
 */
export const getUserByUsername = async (
  username: string,
  config: IConfig = { return: true }
) => {
  var params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "CardCollab",
    IndexName: "GSI1",
    KeyConditionExpression: "sortKey = :sk and var1 = :username",
    ExpressionAttributeValues: {
      ":sk": "user#info#username",
      ":username": username,
    },
  };
  return await docClient
    .query(params)
    .promise()
    .then(async (data) => {
      const userID = data.Items[0].partitionKey.substring(5);
      console.log(userID);

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
      return new Error("Cant find user by username");
    });
};
