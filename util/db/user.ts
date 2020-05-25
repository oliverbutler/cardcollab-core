import nanoid from "nanoid";
import AWS from "aws-sdk";
import { isEmpty, capitalize } from "util/functions";
import { schema } from "schema/user";

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
  birthDate: string;
  createdAt: string;
  updatedAt: string;
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
  userID: string = nanoid.nanoid(),
  givenName: string,
  familyName: string,
  username: string,
  email: string,
  birthDate: string,
  role: string[] = ["student"]
) => {
  var check = null;

  var validate = schema.validate({
    givenName,
    familyName,
    username,
    email,
    birthDate,
    role,
  });

  validate.value.givenName = capitalize(validate.value.givenName);
  validate.value.familyName = capitalize(validate.value.familyName);

  if (validate.error) {
    throw new Error(validate.error);
  }

  // Check if the email is taken
  try {
    check = await getUserByEmail(email, { return: false });
  } catch (err) {}
  if (check) throw new Error("Email Taken");

  // Check if the username is taken
  try {
    check = await getUserByUsername(username, { return: false });
  } catch (err) {}

  if (check) throw new Error("Username Taken");

  // Write all of the users metadata to the DB
  var params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info`,
            givenName: validate.value.givenName,
            familyName: validate.value.familyName,
            birthDate: validate.value.birthDate,
            var1: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            role: validate.value.role,
            username: validate.value.username.toLowerCase(),
            vanityUsername: validate.value.username,
            email: validate.value.email.toLowerCase(),
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info#username`,
            var1: validate.value.username.toLowerCase(),
          },
        },
      },
      {
        Put: {
          TableName: "CardCollab",
          Item: {
            partitionKey: `user#${userID}`,
            sortKey: `user#info#email`,
            var1: validate.value.email.toLowerCase(),
          },
        },
      },
    ],
  };

  return docClient
    .transactWrite(params)
    .promise()
    .then((res) => {
      return "Successfully Created";
    });
};

/**
 * Update a user given user id and properties to update
 *
 * @param userID
 * @param properties
 */
export const updateUser = async (userID: string, properties: IUser) => {};

/**
 * Get a user given their userID
 *
 * @param userID
 */
export const getUserByID = (userID: string) => {
  var params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: "CardCollab",
    Key: {
      partitionKey: `user#${userID}`,
      sortKey: "user#info",
    },
  };

  return docClient
    .get(params)
    .promise()
    .then((data) => {
      if (isEmpty(data)) {
        throw new Error(`User not found: getUserByID("${userID}")`);
      }

      const user: IUser = {
        userID: userID,
        givenName: data.Item["givenName"],
        familyName: data.Item["familyName"],
        role: data.Item["role"],
        email: data.Item["email"],
        username: data.Item["vanityUsername"],
        birthDate: data.Item["birthDate"],
        createdAt: data.Item["var1"],
        updatedAt: data.Item["updatedAt"],
      };
      return user;
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
  return docClient
    .query(params)
    .promise()
    .then(async (data) => {
      if (data.Count == 0) {
        throw new Error(`No user found: getUserByEmail("${email}")`);
      }

      const userID = data.Items[0].partitionKey.substring(5);

      if (config.return)
        return await getUserByID(userID).then((data) => {
          return data;
        });
      else return userID;
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
  return docClient
    .query(params)
    .promise()
    .then(async (data) => {
      if (data.Count == 0)
        throw new Error(`No user found: getUserByUsername("${username}")`);

      const userID = data.Items[0].partitionKey.substring(5);

      if (config.return)
        return await getUserByID(userID).then((data) => {
          return data;
        });
      else return userID;
    });
};
