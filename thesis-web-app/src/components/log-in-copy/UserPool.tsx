import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "eu-central-1_cxpa8HjUZ",
  ClientId: "m7f35dnb6b0vpk099bd4fqsul",
};

export default new CognitoUserPool(poolData);
