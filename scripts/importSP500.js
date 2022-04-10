const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

const config = require('../config.js');
const constituents = require('./data/constituents.json');

const REGION = config.aws.region; // e.g. "us-east-1"
const IDENTITY_POOL_ID = config.aws.admin_identity_pool_id;

// Create an Amazon DynamoDB service client object.
const dynamoClient = new DynamoDBClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
});

(async () => {
  let params = {
    RequestItems: {
      'sd.sp500': [
        {
          PutRequest: {
            Item: {
              ticker: { S: 'FDS' },
              name: { S: 'FactSet' },
              sector : {S: 'Financials' }
            },
          },
        }
      ],
    },
  };

  let counter = 0;
  let items = [];
  for( const constituent of constituents) {
    counter++;
    items.push({
      PutRequest: {
        Item: {
          symbol : { S: constituent.Symbol },
          name : { S: constituent.Name },
          sector : { S : constituent.Sector}
        }
      }
    });
    if(counter >= 20) {
      counter = 0;
      params.RequestItems['sd.sp500'] = items;
      await dynamoClient.send(new BatchWriteItemCommand(params));
      items = [];
    }
  }
  if(items.length > 0) {
    params.RequestItems['sd.sp500'] = items;
    await dynamoClient.send(new BatchWriteItemCommand(params));
  }

  console.info("Data added to table.");
})();
