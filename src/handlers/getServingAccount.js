import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getServingAccount(event, context) {
  let serving_account;
  const { id } = event.pathParameters;

  try{
    const result = await dynamodb.get({
        TableName: process.env.SERVING_ACCOUNTS_TABLE_NAME,
        Key: { id },
    }).promise();

    serving_account = result.Item;
  } catch (error) {
      console.error(error);
      throw new createError.InternalServerError(error);
  }

  if(!serving_account) {
      throw new createError.NotFound('Order with ID "${id}" not found!');
  }

  return {
    statusCode: 200,
    body: JSON.stringify({serving_account}),
  };
}

export const handler = commonMiddleware(getServingAccount);


