'use strict';

var config = require("./conf");

var bot_dailog = require("./bot/bot")
var botbuilder_linebot_connector_1 = require("botbuilder-linebot-connector");
var botbuilder_mongodb_storage_1 = require("botbuilder-mongodb-storage");
var builder = require('botbuilder');
var connector = new botbuilder_linebot_connector_1.LineConnector({
  hasPushApi: false,
  // your line
  channelId: process.env.channelId || config.channelId,
  channelSecret: process.env.channelSecret || config.channelSecret,
  channelAccessToken: process.env.channelAccessToken || config.channelAccessToken
});

var bot = new builder.UniversalBot(connector)
  .set("storage", new botbuilder_mongodb_storage_1.MongoDbStorage({
    DatabaseName: config.DatabaseName,
    collectionName: config.collectionName,
    mongoIp: config.mongoIp,
    mongoPort: config.mongoPort,
    // mongoIp: "ds125578.mlab.com",
    // mongoPort: "255xx",
    // username: config.username,
    // password: config.password
  }));
  bot_dailog.default(bot)
  // bot.dialog("/",s=>{
  //   s.beginDialog("good")
  // })
// bot.dialog("/", [
//   function (s) {
//     builder.Prompts.text(s, "name?");
//   },
//   function (s, r) {
//     s.userData.name = r.response;
//     console.log("after name", s.userData);
//     builder.Prompts.number(s, "age?");
//   },
//   function (s, r) {
//     console.log("after age", s.userData);
//     s.userData.age = r.response;
//     s.endDialog("bady " + s.userData.name);
//   }
// ]);
module.exports.line = (event, context, callback) => {
  connector.serverlessWebhock(event)
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};