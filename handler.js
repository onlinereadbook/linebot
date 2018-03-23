'use strict';
// Import dependencies
const DynamoDB = require('aws-sdk/clients/dynamodb');
const { DynamoBotStorage } = require('botbuilder-dynamodb-storage');

const client = new DynamoDB({ region: "ap-northeast-1" });

// Define the adapter settings
const settings = {
  // Required
  tableName: process.env.DYNAMODB_TABLE,

  // Required
  primaryKey: "id",

  // Optional but strongly recommended!
  ttl: {
    userData: 3600 * 24 * 365, // a year,
    conversationData: 3600 * 24 * 7, // a week,
    privateConversationData: 3600 * 24 * 7
  }
};
// Instantiate the adapter with the client and settings.
const adapter = new DynamoBotStorage(client, settings)

var config = require("./conf");
// console.log("config", config)

var bot_dailog = require("./bot/bot")
var botbuilder_linebot_connector_1 = require("botbuilder-linebot-connector");
// var botbuilder_mongodb_storage_1 = require("botbuilder-mongodb-storage");
var builder = require('botbuilder');
var connector = new botbuilder_linebot_connector_1.LineConnector({
  hasPushApi: true,
  // your line
  channelId: process.env.channelId || config.channelId,
  channelSecret: process.env.channelSecret || config.channelSecret,
  channelAccessToken: process.env.channelAccessToken || config.channelAccessToken
});

var bot = new builder.UniversalBot(connector).set('storage', adapter);

bot_dailog.default(bot)

module.exports.line = (event, context, callback) => {
  console.log("event", event)
  connector.serverlessWebhock(event)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'line webhock!',
      input: event,
    }),
  };
  callback(null, response);
};



module.exports.notify = (event, context, callback) => {
  let body = JSON.parse(event.body);

  let LineId = body.LineId;
  let title = body.title
  let description = body.description;
  // let startTime = body.startTime;graph
  let item = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: { ["id"]: { S: LineId } },
  };
  client.getItem(item, (err, doc) => {
    if (err) {
      return reject(err);
    }
    let docItem = doc && doc.Item || {};
    let addressString = docItem.address && docItem.address.S && JSON.parse(docItem.address.S) || {};
    console.log("addressString", addressString)

    if (addressString.conversation) {
      // console.log("addressString", addressString)

      var msg = new builder.Message().address(addressString);
      msg.text(title + " " + description);
      bot.send(msg);
      let response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'done',
          input: event,
        }),
      };
      callback(null, response);
    } else {
      let response = {
        statusCode: 400,
        body: JSON.stringify({
          message: 'can not find user!',
          input: event,
        }),
      };
      callback(null, response);

    }
  })


};


