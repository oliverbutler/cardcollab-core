import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-west-2_hnNS8DXpa",
  ClientId: "60n8v5u8un86kqmv3tnihfck5k",
};

export default new CognitoUserPool(poolData);
