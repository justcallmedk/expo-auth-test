import * as AppAuth from "expo-app-auth";

const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { DynamoDBClient, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

export async function get(id) {
  console.info('finding item');
  // Set the parameters
  const params = {
    TableName: 'myTables2',
    ExpressionAttributeNames : {
      "#name" : "name"
    },
    ExpressionAttributeValues: {
      ":id" : parseInt(id),
      ":name" : name
    },
    KeyConditionExpression : 'id = :id',
    FilterExpression :  'begins_with(#name, :name)'
  };

  const data = await dynamoClient.send(new QueryCommand(params));
  console.info(data.Items[0]);
}
