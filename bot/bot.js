"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
// const fetch = require("isomorphic-fetch")
const query_1 = require("./../lib/query");
var config = require("./../conf");
var LineConnector = require("botbuilder-linebot-connector");
// var linebot = require("botbuilder-linebot-connector");
var connector = new LineConnector.LineConnector({
    hasPushApi: true,
    // your line
    channelId: process.env.channelId || config.channelId,
    channelSecret: process.env.channelSecret || config.channelSecret,
    channelAccessToken: process.env.channelAccessToken || config.channelAccessToken
});
exports.default = (bot) => {
    function sendProactiveMessage(address) {
        var msg = new builder.Message().address(address);
        msg.text('Hello, this is a notification');
        msg.textLocale('en-US');
        bot.send(msg);
    }
    bot.dialog("/", s => { });
    bot.dialog('help', function (session, args, next) {
        session.endDialog("我是小書");
    }).triggerAction({
        matches: /^help$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
    bot.on('conversationUpdate', function (message) {
        return __awaiter(this, void 0, void 0, function* () {
            // detect event
            console.log("conversationUpdate");
            switch (message.text) {
                case 'follow':
                    break;
                case 'unfollow':
                    break;
                case 'join':
                    break;
                case 'leave':
                    break;
            }
            var isGroup = message.address.conversation.isGroup;
            if (isGroup) {
                bot.beginDialog(message.address, "helloGroup");
            }
            else {
                bot.beginDialog(message.address, "helloUser");
            }
        });
    });
    bot.dialog("helloGroup", [(s) => __awaiter(this, void 0, void 0, function* () {
            s.send("大家好！感謝將我加進群裡！要和我互動一定要加我為好友！不然我是收不到你的訊息的！需我服務時，請直輸入 menu ，就可以呼叫出下面的選單，這是我目前的功能，感謝大家！");
            s.send("menu");
            s.beginDialog("menu");
        })
    ]);
    bot.dialog("helloUser", [(s) => __awaiter(this, void 0, void 0, function* () {
            // console.log(s.message)
            let u = yield connector.getUserProfile(s.message.user.id);
            s.endDialog(u.displayName + "好！感謝加我為好友! 將我加入群組，我才能揮功用喔！");
        })]);
    bot.dialog("menu", [
        (s) => __awaiter(this, void 0, void 0, function* () {
            s.endDialog(new builder.Message(s)
                .addAttachment(new builder.HeroCard(s)
                .title("我是小書")
                .subtitle("線上讀書會賴群管理機器人")
                .text("我是小書:線上讀書會賴群管理機器人")
                .images([builder.CardImage.create(s, 'https://imagelab.nownews.com/?w=1080&q=85&src=http://s.nownews.com/11/b9/11b93df1ec7012f4d772c8bb0ac74e10.png')])
                .buttons([
                builder.CardAction.imBack(s, "即將舉辦的讀書會", "即將舉辦的讀書會"),
                builder.CardAction.imBack(s, "之前的讀書會", "之前的讀書會"),
                builder.CardAction.openUrl(s, "https://docs.google.com/forms/d/1n20MX3dMIw0U1k0V1eFM6yzzOZ3QkfW2wgLelTmRYNY/edit?usp=sharing", "建議事項"),
                builder.CardAction.imBack(s, "關於我", "關於我"),
            ])));
        })
    ]).triggerAction({
        matches: /^menu$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
    function getEventList(query, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let a = yield query_1.get_ql_data(query, key);
            // console.log("a", a)
            let text = "";
            a.map((d, i) => {
                if (i < 10) {
                    let startTime = Date.parse(d.startTime);
                    console.log(startTime);
                    let t = new Date(startTime);
                    text += `${d.title} ${t.toLocaleString()}\r\n`;
                }
            });
            return text;
        });
    }
    bot.dialog("即將舉辦的讀書會", (s) => __awaiter(this, void 0, void 0, function* () {
        let text = yield getEventList(`{
            FbEventQuery(skip:0){  
              parentGroupId
              parentGroupName,
              owner ,
              description,
              title,
              startTime,
              image,
              eventId
          }
          }`, "FbEventQuery");
        s.endDialog(text);
        //query server data
    })).triggerAction({
        matches: /^即將舉辦的讀書會$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
    bot.dialog("之前的讀書會", s => {
        s.endDialog("show 之前的讀書會");
        //query server data
        //show 
        s.send("list ....");
    }).triggerAction({
        matches: /^之前的讀書會$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
    bot.dialog("showLineId", s => {
        console.log(s.message.address.channel.id);
        let id = "" + s.message.address.channel.id;
        s.endDialog(id);
    }).triggerAction({
        matches: /^showLineId$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
    bot.dialog("關於我", s => {
        s.endDialog("show 關於我");
    }).triggerAction({
        matches: /^關於我$/i,
        onSelectAction: (session, args, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });
};
