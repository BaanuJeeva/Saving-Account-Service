import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function deleteServingAccount(event, context) {
    const {id} = event.pathParameters;
  let res;

  const params = {
    TableName: process.env.SERVING_ACCOUNTS_TABLE_NAME,
    ConditionExpression:'id = :id',
    ExpressionAttributeValues: {
        ":id": id
    },
    Key:{
        "id": id
    }    
  };

  try {
    const result = await dynamodb.delete(params).promise();
     res = result;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({"message":"Deleted"}),
  };
}

export const handler = commonMiddleware(deleteServingAccount)
