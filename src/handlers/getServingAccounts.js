import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getServingAccounts(event, context) {
  let serving_accounts;

  try{
    const result = await dynamodb.scan({ 
        TableName: process.env.SERVING_ACCOUNTS_TABLE_NAME,
    }).promise();

    serving_accounts = result.Items;
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);  
  }

  return {
    statusCode: 200,
    body: JSON.stringify({serving_accounts}),
  };
}

export const handler = commonMiddleware(getServingAccounts);


