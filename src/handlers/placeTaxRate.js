import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeTaxRate(event, context) {

  const { id } = event.pathParameters;
  const { withholdingTexRate } = event.body;

  const params = {
      TableName: process.env.SERVING_ACCOUNTS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestTaxRate.withholdingTexRate = :withholdingTexRate',
      ExpressionAttributeValues: {
        ':withholdingTexRate': withholdingTexRate,
      },
      ReturnValues: 'ALL_NEW',
  };
  
  let update_serving_account;

  try{
    const result = await dynamodb.update(params).promise();
    update_serving_account = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({update_serving_account}),
  };
}

export const handler = commonMiddleware(placeTaxRate);


