"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
exports.default = (bot) => {
    bot.dialog("/", [
        function (s) {
            builder.Prompts.text(s, "name?");
        },
        function (s, r) {
            s.userData.name = r.response;
            console.log("after name", s.userData);
            builder.Prompts.number(s, "age?");
        },
        function (s, r) {
            console.log("after age", s.userData);
            s.userData.age = r.response;
            s.endDialog("bady " + s.userData.name);
        }
    ]);
};
