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
var config = require("./../conf");
var linebot = require("botbuilder-linebot-connector");
var connector = new linebot.LineConnector({
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
    bot.dialog("/", [
        function (s) {
            // var savedAddress = s.message.address;
            // // console.log("savedAddress", savedAddress)
            // s.send("我是小書");
            // setTimeout(() => {
            //     sendProactiveMessage(savedAddress);
            // }, 5000);
        }
    ]);
    bot.dialog('help', function (session, args, next) {
        session.endDialog("我是小書");
    })
        .triggerAction({
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
            s.send("大家好！感謝將我加進群裡！");
            s.send("要和我互動一定要加我為好友！");
            s.send("不然我是收不到你的訊息的！");
            s.endDialog("謝謝大家！");
        })]);
    bot.dialog("helloUser", [(s) => __awaiter(this, void 0, void 0, function* () {
            // console.log(s.message)
            let u = yield connector.getUserProfile(s.message.user.id);
            s.send(u.displayName + "好！感謝將我加進群裡！");
            s.endDialog("謝謝 " + u.displayName);
        })]);
};
