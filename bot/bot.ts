import * as builder from "botbuilder"

export default (bot: builder.UniversalBot) => {
    bot.dialog("/", [
        function (s) {
            builder.Prompts.text(s, "name?");
        }
    ]);

}
