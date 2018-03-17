import * as builder from "botbuilder"
var linebot = require("botbuilder-linebot-connector");


export default (bot: builder.UniversalBot) => {
    function sendProactiveMessage(address: any) {
        var msg = new builder.Message().address(address);
        msg.text('Hello, this is a notification');
        msg.textLocale('en-US');
        bot.send(msg);
    }


    bot.dialog("/", [
        function (s) {
            var savedAddress = s.message.address;
            console.log("savedAddress", savedAddress)
            s.send("我是小書");

            setTimeout(() => {
                sendProactiveMessage(savedAddress);
            }, 5000);

        }
    ]);
}




