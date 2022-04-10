require("react-native-get-random-values");
require("react-native-url-polyfill/auto");
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const config = require('../config.js');


const REGION = "us-east-1"; // e.g. "us-east-1"
const IDENTITY_POOL_ID = config.aws.user_identity_pool_id;

// Create an Amazon DynamoDB service client object.
const dynamoClient = new DynamoDBClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

export { dynamoClient };
