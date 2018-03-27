
import * as builder from "botbuilder";
// const fetch = require("isomorphic-fetch")
import { get_ql_data, notify } from "./../lib/query"
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

export default (bot: builder.UniversalBot) => {
    function sendProactiveMessage(address: any) {
        var msg = new builder.Message().address(address);
        msg.text('Hello, this is a notification');
        msg.textLocale('en-US');
        bot.send(msg);
    }
    bot.dialog("/", s => { })


    bot.dialog('help', function (session, args, next) {
        session.endDialog("我是小書");
    }).triggerAction({
        matches: /^help$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

    bot.on('conversationUpdate', async function (message) {
        // detect event
        // console.log("conversationUpdate", message)



        // console.log(a)
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
            let q = `mutation{
                FbGroupCheckLine(groupId:"temp",lineId:"${message.address.channel.id}"){
                  lineId
                  groupId
                }
              }`
            let a = await get_ql_data(q, "FbGroupCheckLine");

            bot.beginDialog(message.address, "helloGroup")
        } else {
            bot.beginDialog(message.address, "helloUser")
        }
    });

    bot.dialog("helloGroup", [async (s: any) => {
        // let p = await connector.getUserProfile(s.message.address.channel.id)
        // console.log(p);

        s.send("大家好！感謝將我加進群裡！要和我互動一定要加我為好友！不然我是收不到你的訊息的！需我服務時，請直輸入 menu ，就可以呼叫出下面的選單，這是我目前的功能，感謝大家！")
        s.send("menu")
        s.beginDialog("menu");
    }
    ])

    bot.dialog("helloUser", [async (s) => {
        // console.log(s.message)
        let u = await connector.getUserProfile(s.message.user.id)

        s.endDialog(u.displayName + "好！感謝加我為好友! 將我加入群組，我才能揮功用喔！")
    }])

    bot.dialog("menu", [
        async (s: any) => {
            var isGroup = s.message.address.conversation.isGroup;
            if (isGroup) {
                s.endDialog(new builder.Message(s)
                    .addAttachment(
                        new builder.HeroCard(s)
                            .title("我是小書")
                            .subtitle("線上讀書會賴群管理機器人")
                            .text("我是小書:線上讀書會賴群管理機器人")
                            .images([builder.CardImage.create(s, 'https://17book.me/static/logo/logo-with-blank.png')])

                            .buttons([
                                builder.CardAction.postBack(s, "即將舉辦的讀書會", "即將舉辦的讀書會"),
                                builder.CardAction.postBack(s, "之前的讀書會", "之前的讀書會"),
                                builder.CardAction.openUrl(s, "https://docs.google.com/forms/d/1n20MX3dMIw0U1k0V1eFM6yzzOZ3QkfW2wgLelTmRYNY/edit?usp=sharing", "建議事項"),
                                builder.CardAction.postBack(s, "關於我", "關於我"),
                            ])
                    ));
            } else {
                s.endDialog(new builder.Message(s)
                    .addAttachment(
                        new builder.HeroCard(s)
                            .title("我是小書")
                            .subtitle("線上讀書會賴群管理機器人")
                            .text("我是小書:線上讀書會賴群管理機器人")
                            .images([builder.CardImage.create(s, 'https://17book.me/static/logo/logo-with-blank.png')])

                            .buttons([
                                builder.CardAction.openUrl(s, "https://docs.google.com/forms/d/1n20MX3dMIw0U1k0V1eFM6yzzOZ3QkfW2wgLelTmRYNY/edit?usp=sharing", "建議事項"),
                                builder.CardAction.postBack(s, "關於我", "關於我"),
                            ])
                    ));
            }

        }
    ]).triggerAction({
        matches: /^menu$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

    async function getEventList(query: string, key: string) {
        let a: Array<any> = await get_ql_data(query, key)

        console.log("a", a)
        let text = "";
        if (a) {
            a.map((d, i) => {
                if (i < 10) {
                    let startTime = Date.parse(d.startTime)
                    // console.log(startTime)
                    let t = new Date(startTime)
                    text += `${d.title} ${t.toLocaleString()}\r\n`;
                }
            })
        }

        return text;

    }


    bot.dialog("即將舉辦的讀書會", async (s: any) => {
        // console.log(s.message.address)
        let q = `{
            FbEventQueryAfter(lineId:"${s.message.address.channel.id}",skip:0){  
              parentGroupId
              parentGroupName,
              owner ,
              description,
              title,
              startTime,
              image,
              eventId
          }
          }`

        let text = await getEventList(q, "FbEventQueryAfter");
        // console.log("text", text.length)

        var isGroup = s.message.address.conversation.isGroup;
        if (isGroup) {
            //send to user
            try {
                let r = await notify(s.message.from.id, "", text.length > 0 ? text : "目前無讀書會將舉辦！")

                s.conversationData.alert = false;

            } catch (e) {
                if (!s.conversationData.alert) {

                    s.endDialog("那位朋友按了 即將舉辦的讀書會　，請先加我好友，我才能讀到你喔！");
                }
                s.conversationData.alert = true;

            }

            s.endDialog()
        } else {
            s.endDialog(text)
        }
        //query server data
    }).triggerAction({
        matches: /^即將舉辦的讀書會$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

    bot.dialog("之前的讀書會", async (s: any) => {
        let q = `{
            FbEventQueryBefore(lineId:"${s.message.address.channel.id}",skip:0){  
              parentGroupId
              parentGroupName,
              owner ,
              description,
              title,
              startTime,
              image,
              eventId
          }
          }`
        // console.log(q)

        let text = await getEventList(q, "FbEventQueryBefore");

        var isGroup = s.message.address.conversation.isGroup;
        if (isGroup) {
            //send to user
            if (isGroup) {
                //send to user
                try {

                    let r = await notify(s.message.from.id, "", text.length > 0 ? text : "過去沒有相關的讀書會！")

                    s.conversationData.alert = false;

                    // console.log("r", r)
                } catch (e) {
                    if (!s.conversationData.alert) {

                        s.endDialog("那位朋友按了 之前的讀書會， 請先加我好友，我才能讀到你喔！")
                    }
                    s.conversationData.alert = true;

                }
            } else {
                s.endDialog(text)
            }
            s.endDialog()
        } else {
            s.endDialog(text)
        }
    }).triggerAction({
        matches: /^之前的讀書會$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });



    bot.dialog("showLineId", (s: any) => {
        console.log(s.message.address.channel.id)
        let id = "" + s.message.address.channel.id;
        s.endDialog(id);
    }).triggerAction({
        matches: /^showLineId$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });

    bot.dialog("關於我", async (s: any) => {
        // console.log("s.message.address", s.message.address)

        let text = "小書 目前是 open source 專案 https://github.com/onlinereadbook/linebot ，以學習Line群的管理為主要目地，有興趣的朋友，歡迎一起開發同歡。\r\n開發者：\r\n  LineBot:Wolke LineId:wolkesau,\r\n後台：polo "
        let isGroup = s.message.address.conversation.isGroup;
        if (isGroup) {

            //send to user
            try {
                let r = await notify(s.message.from.id, "", text)
                s.conversationData.alert = false;

            } catch (e) {
                if (!s.conversationData.alert) {
                    s.endDialog("那位朋友按了 關於我 請先加我好友，我才能讀到你喔！");
                    s.conversationData.alert = true;
                }
            }
        } else {
            s.endDialog(text)
        }
        // s.endDialog("show 關於我")

    }).triggerAction({
        matches: /^關於我$/i,
        onSelectAction: (session, args: any, next) => {
            // Add the help dialog to the dialog stack 
            // (override the default behavior of replacing the stack)
            session.beginDialog(args.action, args);
        }
    });




}





