"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builder = require("botbuilder");
exports.default = (bot) => {
    bot.dialog("/", [
        function (s) {
            builder.Prompts.text(s, "name?");
        }
    ]);
};
