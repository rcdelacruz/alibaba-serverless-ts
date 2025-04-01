'use strict';

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Hello from Alibaba Cloud Functions!',
      input: event,
      requestId: context.requestId,
      timestamp: new Date().toISOString()
    }),
    isBase64Encoded: false
  };

  callback(null, response);
};
