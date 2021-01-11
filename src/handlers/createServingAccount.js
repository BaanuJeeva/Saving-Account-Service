import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
//import middy from '@middy/core';
//import httpJsonBodyParser from '@middy/http-json-body-parser';
//import httpEventNormalizer from '@middy/http-event-normalizer';
//import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createServingAccount(event, context) {
  const { monthlyAmount } = event.body;
  const { depositPeriodInMonths } = event.body;
  const { interestRate } = event.body;
  const now = new Date();
//ADDED PROPERTIES IN ORDER OBJECT
  const serving_account = {
    id: uuid(),
    monthlyAmount,
    depositPeriodInMonths,
    interestRate,
    createdAt: now.toISOString(),
    highestTaxRate: {
     //amount: 0,
     withholdingTexRate: 0,
    },
  };

  try{
    await dynamodb.put({
      //TableName: 'ServingAccountsTable',
      TableName: process.env.SERVING_ACCOUNTS_TABLE_NAME,
      Item: serving_account,
    }).promise();
  } catch(error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify({serving_account}),
  };
}


export const handler = commonMiddleware(createServingAccount);


/*
export const handler = middy(createOrder)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
  */





