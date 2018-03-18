"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
var linebot = require("botbuilder-linebot-connector");
exports.default = (bot) => {
    function sendProactiveMessage(address) {
        var msg = new builder.Message().address(address);
        msg.text('Hello, this is a notification');
        msg.textLocale('en-US');
        bot.send(msg);
    }
    bot.dialog("/", [
        function (s) {
            var savedAddress = s.message.address;
            // console.log("savedAddress", savedAddress)
            s.send("我是小書");
            setTimeout(() => {
                sendProactiveMessage(savedAddress);
            }, 5000);
        }
    ]);
};
