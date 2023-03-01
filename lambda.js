const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();

const books = ["The Secret", "To Kill a Mockingbird", "Atomic Habits", "Ikigai", "The Power of your Subconscious Mind"];

function getRandomBook(book) {

    const randomIndex = Math.floor(Math.random() * book.length);

    const item = book[randomIndex];

    return item;
}

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }

    const username = event.requestContext.authorizer.claims['cognito:username'];
    const book = getRandomBook(books);

    storeBook(username, book).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                User: username,
                Book: book,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function storeBook(username, book) {
    return db.put({
        TableName: 'Books',
        Item: {
            User: username,
            Book: book,
        },
    }).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}